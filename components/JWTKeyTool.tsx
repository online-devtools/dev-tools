'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

async function generateRsaKeyPair(): Promise<{ publicPem: string; privatePem: string; jwk: JsonWebKey }> {
  // 브라우저 SubtleCrypto를 사용해 RS256 서명용 키 쌍을 생성합니다.
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  )

  const jwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey)

  const [spki, pkcs8] = await Promise.all([
    crypto.subtle.exportKey('spki', keyPair.publicKey),
    crypto.subtle.exportKey('pkcs8', keyPair.privateKey),
  ])

  const toPem = (buffer: ArrayBuffer, type: 'PUBLIC KEY' | 'PRIVATE KEY') => {
    const b64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
    const chunks = b64.match(/.{1,64}/g)?.join('\n') || ''
    return `-----BEGIN ${type}-----\n${chunks}\n-----END ${type}-----`
  }

  return {
    publicPem: toPem(spki, 'PUBLIC KEY'),
    privatePem: toPem(pkcs8, 'PRIVATE KEY'),
    jwk,
  }
}

function generateHsSecret(length = 32): string {
  // 길이만큼 랜덤 바이트를 생성해 URL-safe Base64 문자열로 반환합니다.
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  const b64 = btoa(String.fromCharCode(...bytes))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export default function JWTKeyTool() {
  const { t } = useLanguage()
  // HS 시크릿, RSA PEM/JWK, 에러 상태를 관리합니다.
  const [hsLength, setHsLength] = useState('32')
  const [hsSecret, setHsSecret] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [jwk, setJwk] = useState('')
  const [error, setError] = useState('')

  const handleGenerateHs = () => {
    try {
      setError('')
      const len = parseInt(hsLength, 10)
      if (isNaN(len) || len < 16 || len > 128) {
        setError(t('jwtKeys.error.hsLength'))
        return
      }
      setHsSecret(generateHsSecret(len))
    } catch (e) {
      setError(t('jwtKeys.error.generic'))
    }
  }

  const handleGenerateRsa = async () => {
    try {
      setError('')
      const { publicPem, privatePem, jwk: jwkObj } = await generateRsaKeyPair()
      setPublicKey(publicPem)
      setPrivateKey(privatePem)
      setJwk(JSON.stringify(jwkObj, null, 2))
    } catch (e) {
      setError(t('jwtKeys.error.rsa'))
    }
  }

  return (
    <ToolCard
      title={`🔑 ${t('jwtKeys.title')}`}
      description={t('jwtKeys.description')}
    >
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('jwtKeys.hs.title')}</h3>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('jwtKeys.hs.length')}
          </label>
          <input
            type="number"
            value={hsLength}
            onChange={(e) => setHsLength(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min={16}
            max={128}
          />
          <button
            onClick={handleGenerateHs}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('jwtKeys.hs.action')}
          </button>
          <TextAreaWithCopy
            value={hsSecret}
            readOnly
            label={t('jwtKeys.hs.result')}
            placeholder=""
          />
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('jwtKeys.rsa.title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('jwtKeys.rsa.note')}</p>
          <button
            onClick={handleGenerateRsa}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('jwtKeys.rsa.action')}
          </button>

          <TextAreaWithCopy
            value={publicKey}
            readOnly
            label={t('jwtKeys.rsa.public')}
            rows={5}
          />
          <TextAreaWithCopy
            value={privateKey}
            readOnly
            label={t('jwtKeys.rsa.private')}
            rows={8}
          />
          <TextAreaWithCopy
            value={jwk}
            readOnly
            label={t('jwtKeys.rsa.jwk')}
            rows={6}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
