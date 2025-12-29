'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type AuthDataSummary = {
  rpIdHash: string
  flags: string[]
  signCount: number
}

const safeJsonParse = (value: string): { ok: boolean; data?: unknown } => {
  try {
    return { ok: true, data: JSON.parse(value) }
  } catch {
    return { ok: false }
  }
}

const base64UrlToBytes = (value: string): Uint8Array => {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

const bytesToHex = (bytes: Uint8Array) => {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

const parseAuthenticatorData = (encoded: string): AuthDataSummary | null => {
  try {
    const bytes = base64UrlToBytes(encoded)
    if (bytes.length < 37) return null
    const rpIdHash = bytesToHex(bytes.slice(0, 32))
    const flagsByte = bytes[32]
    const flags: string[] = []
    if (flagsByte & 0x01) flags.push('UP')
    if (flagsByte & 0x04) flags.push('UV')
    if (flagsByte & 0x08) flags.push('BE')
    if (flagsByte & 0x10) flags.push('BS')
    if (flagsByte & 0x40) flags.push('AT')
    if (flagsByte & 0x80) flags.push('ED')
    const signCount = (bytes[33] << 24) | (bytes[34] << 16) | (bytes[35] << 8) | bytes[36]

    return { rpIdHash, flags, signCount }
  } catch {
    return null
  }
}

const decodeClientData = (encoded: string) => {
  try {
    const bytes = base64UrlToBytes(encoded)
    const text = new TextDecoder().decode(bytes)
    return JSON.parse(text)
  } catch {
    return null
  }
}

export default function WebAuthnTool() {
  const { t } = useLanguage()
  const [mode, setMode] = useState<'register' | 'authenticate'>('register')
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [clientData, setClientData] = useState<any | null>(null)
  const [authSummary, setAuthSummary] = useState<AuthDataSummary | null>(null)
  const [rawLengths, setRawLengths] = useState<string>('')

  const analyze = () => {
    const parsed = safeJsonParse(input)
    if (!parsed.ok || !parsed.data) {
      setError(t('webauthn.error.json'))
      setClientData(null)
      setAuthSummary(null)
      setRawLengths('')
      return
    }

    const data = parsed.data as any
    const response = data.response || {}
    const clientDataJson = response.clientDataJSON

    if (!clientDataJson) {
      setError(t('webauthn.error.clientData'))
      setClientData(null)
      setAuthSummary(null)
      setRawLengths('')
      return
    }

    const decodedClient = decodeClientData(clientDataJson)
    setClientData(decodedClient)

    if (mode === 'authenticate') {
      const authData = response.authenticatorData
      const summary = authData ? parseAuthenticatorData(authData) : null
      setAuthSummary(summary)
    } else {
      setAuthSummary(null)
    }

    const lengthLines = [
      `clientDataJSON: ${clientDataJson.length}`,
      response.attestationObject ? `attestationObject: ${response.attestationObject.length}` : null,
      response.authenticatorData ? `authenticatorData: ${response.authenticatorData.length}` : null,
      response.signature ? `signature: ${response.signature.length}` : null,
      response.userHandle ? `userHandle: ${response.userHandle.length}` : null,
    ].filter(Boolean) as string[]

    setRawLengths(lengthLines.join('\n'))
    setError('')
  }

  const clientSummary = useMemo(() => {
    if (!clientData) return ''
    const lines = [
      `type: ${clientData.type || '-'}`,
      `origin: ${clientData.origin || '-'}`,
      `challenge: ${clientData.challenge || '-'}`,
    ]
    return lines.join('\n')
  }, [clientData])

  return (
    <ToolCard title={`🛡️ ${t('webauthn.title')}`} description={t('webauthn.description')}>
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode('register')}
            className={`px-4 py-2 rounded-lg ${mode === 'register' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {t('webauthn.mode.register')}
          </button>
          <button
            onClick={() => setMode('authenticate')}
            className={`px-4 py-2 rounded-lg ${mode === 'authenticate' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {t('webauthn.mode.authenticate')}
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('webauthn.input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder={t('webauthn.placeholder')}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={analyze} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            {t('webauthn.analyze')}
          </button>
          <button
            onClick={() => {
              setInput('')
              setClientData(null)
              setAuthSummary(null)
              setRawLengths('')
              setError('')
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            {t('webauthn.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {clientData && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('webauthn.clientData')}</div>
            <TextAreaWithCopy value={JSON.stringify(clientData, null, 2)} readOnly rows={6} />
          </div>
        )}

        {authSummary && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('webauthn.authData')}</div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('webauthn.rpIdHash')}</div>
                <div className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">{authSummary.rpIdHash}</div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('webauthn.flags')}</div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{authSummary.flags.join(', ') || '-'}</div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('webauthn.signCount')}</div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{authSummary.signCount}</div>
              </div>
            </div>
          </div>
        )}

        {rawLengths && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('webauthn.lengths')}</div>
            <TextAreaWithCopy value={rawLengths} readOnly rows={5} />
            {clientSummary && <TextAreaWithCopy value={clientSummary} readOnly rows={4} />}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
