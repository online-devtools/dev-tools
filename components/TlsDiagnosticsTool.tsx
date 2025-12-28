'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'

const SAMPLE_TLS = `CONNECTED(00000003)
---
Certificate chain
 0 s:CN=example.com
   i:C=US, O=Let's Encrypt, CN=R3
---
SSL-Session:
    Protocol  : TLSv1.3
    Cipher    : TLS_AES_256_GCM_SHA384
    Session-ID: 1A2B3C4D5E6F
    ALPN protocol: h2
    Verify return code: 0 (ok)
    Extended master secret: no
    Max Early Data: 0
    Server Temp Key: X25519, 253 bits
OCSP Response Status: successful
---
subject=CN=example.com
issuer=C=US, O=Let's Encrypt, CN=R3
notBefore=Sep 12 00:00:00 2024 GMT
notAfter=Dec 11 23:59:59 2024 GMT
`

type TlsSummary = {
  protocol?: string
  cipher?: string
  alpn?: string
  ocsp?: string
  verify?: string
  tempKey?: string
  subject?: string
  issuer?: string
  notBefore?: string
  notAfter?: string
}

const findMatch = (text: string, pattern: RegExp) => {
  const match = text.match(pattern)
  return match ? match[1].trim() : undefined
}

export default function TlsDiagnosticsTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [summary, setSummary] = useState<TlsSummary | null>(null)
  const [error, setError] = useState('')

  const analyze = () => {
    if (!input.trim()) {
      setError(t('tlsDiagnostics.error.empty'))
      setSummary(null)
      return
    }

    const protocol = findMatch(input, /Protocol\s*:\s*([^\n]+)/i)
    const cipher = findMatch(input, /Cipher\s*:\s*([^\n]+)/i)
    const alpn = findMatch(input, /ALPN protocol:\s*([^\n]+)/i)
    const ocsp = findMatch(input, /OCSP Response Status:\s*([^\n]+)/i) || findMatch(input, /OCSP response:\s*([^\n]+)/i)
    const verify = findMatch(input, /Verify return code:\s*([^\n]+)/i)
    const tempKey = findMatch(input, /Server Temp Key:\s*([^\n]+)/i)
    const subject = findMatch(input, /subject=([^\n]+)/i)
    const issuer = findMatch(input, /issuer=([^\n]+)/i)
    const notBefore = findMatch(input, /notBefore=([^\n]+)/i) || findMatch(input, /Not Before:\s*([^\n]+)/i)
    const notAfter = findMatch(input, /notAfter=([^\n]+)/i) || findMatch(input, /Not After\s*:?\s*([^\n]+)/i)

    setSummary({
      protocol,
      cipher,
      alpn,
      ocsp,
      verify,
      tempKey,
      subject,
      issuer,
      notBefore,
      notAfter,
    })
    setError('')
  }

  const summaryRows = useMemo(() => {
    if (!summary) return []
    return [
      { label: t('tlsDiagnostics.protocol'), value: summary.protocol },
      { label: t('tlsDiagnostics.cipher'), value: summary.cipher },
      { label: t('tlsDiagnostics.alpn'), value: summary.alpn },
      { label: t('tlsDiagnostics.ocsp'), value: summary.ocsp },
      { label: t('tlsDiagnostics.verify'), value: summary.verify },
      { label: t('tlsDiagnostics.tempKey'), value: summary.tempKey },
      { label: t('tlsDiagnostics.subject'), value: summary.subject },
      { label: t('tlsDiagnostics.issuer'), value: summary.issuer },
      { label: t('tlsDiagnostics.notBefore'), value: summary.notBefore },
      { label: t('tlsDiagnostics.notAfter'), value: summary.notAfter },
    ]
  }, [summary, t])

  return (
    <ToolCard
      title={`🔐 ${t('tlsDiagnostics.title')}`}
      description={t('tlsDiagnostics.description')}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('tlsDiagnostics.input')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder={t('tlsDiagnostics.placeholder')}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={analyze}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            {t('tlsDiagnostics.analyze')}
          </button>
          <button
            onClick={() => setInput(SAMPLE_TLS)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            {t('tlsDiagnostics.sample')}
          </button>
          <button
            onClick={() => {
              setInput('')
              setSummary(null)
              setError('')
            }}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            {t('tlsDiagnostics.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {summary && (
          <div className="grid gap-3 md:grid-cols-2">
            {summaryRows.map((row) => (
              <div key={row.label} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">{row.label}</div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {row.value || t('tlsDiagnostics.notFound')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
