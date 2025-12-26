"use client"

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { SshKeyError, parseSshPublicKeyWithFingerprint } from '@/utils/sshKeys'

type KeyType = 'rsa' | 'ecdsa' | 'ed25519'

const encodeBase64 = (bytes: Uint8Array): string => {
  // Convert raw bytes into base64 for SSH public key lines.
  if (typeof btoa === 'function') {
    return btoa(String.fromCharCode(...bytes))
  }
  return Buffer.from(bytes).toString('base64')
}

const base64UrlToBytes = (input: string): Uint8Array => {
  // Convert base64url strings (JWK) into raw byte arrays.
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=')
  if (typeof atob === 'function') {
    const binary = atob(padded)
    return Uint8Array.from(binary, (c) => c.charCodeAt(0))
  }
  return Uint8Array.from(Buffer.from(padded, 'base64'))
}

const packUint32 = (value: number): Uint8Array => {
  // SSH wire format encodes lengths as 32-bit big-endian integers.
  return new Uint8Array([
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ])
}

const concatBytes = (parts: Uint8Array[]): Uint8Array => {
  // Join multiple byte arrays into a single contiguous buffer.
  const length = parts.reduce((sum, part) => sum + part.length, 0)
  const buffer = new Uint8Array(length)
  let offset = 0
  parts.forEach((part) => {
    buffer.set(part, offset)
    offset += part.length
  })
  return buffer
}

const packString = (text: string): Uint8Array => {
  // SSH strings are length-prefixed UTF-8 byte sequences.
  const bytes = new TextEncoder().encode(text)
  return concatBytes([packUint32(bytes.length), bytes])
}

const packBytes = (bytes: Uint8Array): Uint8Array => {
  // Generic helper for length-prefixed byte blobs.
  return concatBytes([packUint32(bytes.length), bytes])
}

const packMpint = (bytes: Uint8Array): Uint8Array => {
  // mpint uses two's complement; prepend a zero if the high bit is set.
  if (bytes.length === 0) {
    return packBytes(bytes)
  }
  const needsPadding = (bytes[0] & 0x80) === 0x80
  const padded = needsPadding ? concatBytes([new Uint8Array([0]), bytes]) : bytes
  return packBytes(padded)
}

const buildSshPublicKey = (type: KeyType, jwk: JsonWebKey, comment: string): string => {
  // Convert JWK to SSH public key format so developers can use the output directly.
  if (type === 'rsa') {
    const e = base64UrlToBytes(jwk.e ?? '')
    const n = base64UrlToBytes(jwk.n ?? '')
    const blob = concatBytes([
      packString('ssh-rsa'),
      packMpint(e),
      packMpint(n),
    ])
    return `ssh-rsa ${encodeBase64(blob)} ${comment}`.trim()
  }

  if (type === 'ed25519') {
    const x = base64UrlToBytes(jwk.x ?? '')
    const blob = concatBytes([packString('ssh-ed25519'), packBytes(x)])
    return `ssh-ed25519 ${encodeBase64(blob)} ${comment}`.trim()
  }

  // ECDSA uses curve name and uncompressed public point (0x04 || x || y).
  const curve = jwk.crv ?? 'P-256'
  const curveName = curve === 'P-384' ? 'nistp384' : curve === 'P-521' ? 'nistp521' : 'nistp256'
  const x = base64UrlToBytes(jwk.x ?? '')
  const y = base64UrlToBytes(jwk.y ?? '')
  const point = concatBytes([new Uint8Array([0x04]), x, y])
  const blob = concatBytes([
    packString(`ecdsa-sha2-${curveName}`),
    packString(curveName),
    packBytes(point),
  ])
  return `ecdsa-sha2-${curveName} ${encodeBase64(blob)} ${comment}`.trim()
}

const arrayBufferToPem = (buffer: ArrayBuffer, label: string): string => {
  // Convert DER bytes into PEM for easy copy/paste.
  const bytes = new Uint8Array(buffer)
  const base64 = encodeBase64(bytes)
  const lines = base64.match(/.{1,64}/g) ?? []
  return [`-----BEGIN ${label}-----`, ...lines, `-----END ${label}-----`].join('\n')
}

export default function SshKeyTool() {
  const { t } = useLanguage()
  // Key generation inputs and outputs live in local state.
  const [keyType, setKeyType] = useState<KeyType>('rsa')
  const [rsaBits, setRsaBits] = useState(2048)
  const [ecdsaCurve, setEcdsaCurve] = useState('P-256')
  const [comment, setComment] = useState('user@example.com')
  const [publicKeyPem, setPublicKeyPem] = useState('')
  const [privateKeyPem, setPrivateKeyPem] = useState('')
  const [sshPublicKey, setSshPublicKey] = useState('')
  const [error, setError] = useState('')
  const [analyzeInput, setAnalyzeInput] = useState('')
  const [analysisResult, setAnalysisResult] = useState<{
    type: string
    bits?: number
    comment: string
    fingerprint: string
  } | null>(null)

  const generateKeyPair = async () => {
    try {
      setError('')
      setPublicKeyPem('')
      setPrivateKeyPem('')
      setSshPublicKey('')

      let keyPair: CryptoKeyPair
      if (keyType === 'rsa') {
        // RSA uses modulus length and public exponent for key generation.
        keyPair = await crypto.subtle.generateKey(
          {
            name: 'RSASSA-PKCS1-v1_5',
            modulusLength: rsaBits,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256',
          },
          true,
          ['sign', 'verify']
        )
      } else if (keyType === 'ecdsa') {
        // ECDSA generates keys for the chosen named curve.
        keyPair = await crypto.subtle.generateKey(
          {
            name: 'ECDSA',
            namedCurve: ecdsaCurve,
          },
          true,
          ['sign', 'verify']
        )
      } else {
        // Ed25519 is the modern default if supported by the browser.
        keyPair = await crypto.subtle.generateKey(
          {
            name: 'Ed25519',
          },
          true,
          ['sign', 'verify']
        )
      }

      const [privateDer, publicDer, jwk] = await Promise.all([
        crypto.subtle.exportKey('pkcs8', keyPair.privateKey),
        crypto.subtle.exportKey('spki', keyPair.publicKey),
        crypto.subtle.exportKey('jwk', keyPair.publicKey),
      ])

      setPrivateKeyPem(arrayBufferToPem(privateDer, 'PRIVATE KEY'))
      setPublicKeyPem(arrayBufferToPem(publicDer, 'PUBLIC KEY'))
      setSshPublicKey(buildSshPublicKey(keyType, jwk, comment))
    } catch (err) {
      setError(t('sshKey.error.generate'))
    }
  }

  const handleAnalyze = async () => {
    try {
      setError('')
      // Parse the SSH public key to show type, bits, and fingerprint.
      const parsed = await parseSshPublicKeyWithFingerprint(analyzeInput)
      setAnalysisResult({
        type: parsed.type,
        bits: parsed.bits,
        comment: parsed.comment,
        fingerprint: parsed.fingerprintSha256 ?? '-',
      })
    } catch (err) {
      if (err instanceof SshKeyError) {
        if (err.code === 'empty') {
          setError(t('sshKey.error.empty'))
        } else {
          setError(t('sshKey.error.invalid'))
        }
      } else {
        setError(t('sshKey.error.unknown'))
      }
      setAnalysisResult(null)
    }
  }

  const handleClear = () => {
    // Reset both generator and analyzer states.
    setKeyType('rsa')
    setRsaBits(2048)
    setEcdsaCurve('P-256')
    setComment('user@example.com')
    setPublicKeyPem('')
    setPrivateKeyPem('')
    setSshPublicKey('')
    setAnalyzeInput('')
    setAnalysisResult(null)
    setError('')
  }

  return (
    <ToolCard
      title={`🔑 ${t('sshKey.title')}`}
      description={t('sshKey.description')}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('sshKey.section.generate')}
          </h3>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('sshKey.type.label')}
              </label>
              <select
                value={keyType}
                onChange={(e) => setKeyType(e.target.value as KeyType)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="rsa">RSA</option>
                <option value="ecdsa">ECDSA</option>
                <option value="ed25519">Ed25519</option>
              </select>
            </div>
            {keyType === 'rsa' && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('sshKey.rsaBits.label')}
                </label>
                <select
                  value={rsaBits}
                  onChange={(e) => setRsaBits(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value={2048}>2048</option>
                  <option value={3072}>3072</option>
                  <option value={4096}>4096</option>
                </select>
              </div>
            )}
            {keyType === 'ecdsa' && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('sshKey.ecdsaCurve.label')}
                </label>
                <select
                  value={ecdsaCurve}
                  onChange={(e) => setEcdsaCurve(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="P-256">P-256</option>
                  <option value="P-384">P-384</option>
                  <option value="P-521">P-521</option>
                </select>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('sshKey.comment.label')}
              </label>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={generateKeyPair}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {t('sshKey.actions.generate')}
            </button>
            <button
              onClick={handleClear}
              className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              {t('sshKey.actions.clear')}
            </button>
          </div>

          {publicKeyPem && (
            <div className="space-y-3">
              <TextAreaWithCopy
                value={sshPublicKey}
                readOnly
                label={t('sshKey.output.ssh')}
                placeholder={t('sshKey.output.sshPlaceholder')}
                rows={3}
              />
              <TextAreaWithCopy
                value={publicKeyPem}
                readOnly
                label={t('sshKey.output.publicPem')}
                placeholder={t('sshKey.output.publicPemPlaceholder')}
                rows={6}
              />
              <TextAreaWithCopy
                value={privateKeyPem}
                readOnly
                label={t('sshKey.output.privatePem')}
                placeholder={t('sshKey.output.privatePemPlaceholder')}
                rows={6}
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('sshKey.section.analyze')}
          </h3>
          <TextAreaWithCopy
            value={analyzeInput}
            onChange={setAnalyzeInput}
            label={t('sshKey.analyze.label')}
            placeholder={t('sshKey.analyze.placeholder')}
            rows={4}
          />
          <button
            onClick={handleAnalyze}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('sshKey.actions.analyze')}
          </button>

          {analysisResult && (
            <div className="grid gap-3 md:grid-cols-2 text-sm">
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="text-gray-500 dark:text-gray-400">{t('sshKey.result.type')}</div>
                <div className="font-mono text-gray-800 dark:text-gray-100">{analysisResult.type}</div>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="text-gray-500 dark:text-gray-400">{t('sshKey.result.bits')}</div>
                <div className="font-mono text-gray-800 dark:text-gray-100">{analysisResult.bits ?? '-'}</div>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="text-gray-500 dark:text-gray-400">{t('sshKey.result.comment')}</div>
                <div className="font-mono text-gray-800 dark:text-gray-100">{analysisResult.comment || '-'}</div>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="text-gray-500 dark:text-gray-400">{t('sshKey.result.fingerprint')}</div>
                <div className="font-mono text-gray-800 dark:text-gray-100">{analysisResult.fingerprint}</div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
