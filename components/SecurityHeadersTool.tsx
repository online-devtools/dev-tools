'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  analyzeSecurityHeaders,
  SecurityHeadersAnalysis,
  SecurityHeadersError,
  SecurityHeaderItem,
  SecurityHeaderStatus,
} from '@/utils/securityHeaders'

// Sample header block helps users verify the analyzer quickly.
const sampleHeaders = [
  "Content-Security-Policy: default-src 'self'",
  'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options: nosniff',
  'X-Frame-Options: DENY',
  'Referrer-Policy: no-referrer',
  'Permissions-Policy: geolocation=()',
  'Cross-Origin-Opener-Policy: same-origin',
  'Cross-Origin-Embedder-Policy: require-corp',
  'Cross-Origin-Resource-Policy: same-origin',
].join('\n')

const statusStyles: Record<SecurityHeaderStatus, string> = {
  ok: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
  warn: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
  missing: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
}

const statusBorder: Record<SecurityHeaderStatus, string> = {
  ok: 'border-green-200 dark:border-green-900/40',
  warn: 'border-yellow-200 dark:border-yellow-900/40',
  missing: 'border-red-200 dark:border-red-900/40',
}

export default function SecurityHeadersTool() {
  const { t } = useLanguage()
  // Track input and analysis output for the report view.
  const [input, setInput] = useState('')
  const [analysis, setAnalysis] = useState<SecurityHeadersAnalysis | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = () => {
    try {
      setError('')
      // Analyze header text into structured findings for display.
      const result = analyzeSecurityHeaders(input)
      setAnalysis(result)
    } catch (err) {
      setAnalysis(null)
      if (err instanceof SecurityHeadersError) {
        if (err.code === 'empty') {
          setError(t('securityHeaders.error.empty'))
          return
        }
        if (err.code === 'invalidLine') {
          setError(t('securityHeaders.error.invalidLine', { line: err.line ?? '-' }))
          return
        }
      }
      setError(t('securityHeaders.error.unknown'))
    }
  }

  const handleSample = () => {
    // Seed the input with a clean sample to preview the output.
    setInput(sampleHeaders)
    setAnalysis(null)
    setError('')
  }

  const handleClear = () => {
    // Reset all fields so a new header set can be analyzed.
    setInput('')
    setAnalysis(null)
    setError('')
  }

  const renderMessage = (item: SecurityHeaderItem) => {
    // Map analyzer codes to localized UI strings.
    return t(`securityHeaders.messages.${item.messageCode}`, item.meta)
  }

  return (
    <ToolCard
      title={`🛡️ ${t('securityHeaders.title')}`}
      description={t('securityHeaders.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('securityHeaders.input.label')}
          placeholder={t('securityHeaders.input.placeholder')}
          rows={10}
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAnalyze}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('securityHeaders.actions.analyze')}
          </button>
          <button
            onClick={handleSample}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('securityHeaders.actions.sample')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('securityHeaders.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-700 dark:text-green-200">
                {t('securityHeaders.summary.ok', { count: analysis.summary.ok })}
              </div>
              <div className="rounded-lg border border-yellow-200 dark:border-yellow-900/40 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-200">
                {t('securityHeaders.summary.warn', { count: analysis.summary.warn })}
              </div>
              <div className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-200">
                {t('securityHeaders.summary.missing', { count: analysis.summary.missing })}
              </div>
            </div>

            <div className="space-y-3">
              {analysis.items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-lg border px-4 py-3 ${statusBorder[item.status]} bg-white dark:bg-gray-900`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold text-gray-800 dark:text-gray-100">
                      {t(`securityHeaders.items.${item.id}.title`)}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[item.status]}`}
                    >
                      {t(`securityHeaders.status.${item.status}`)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {renderMessage(item)}
                  </div>
                  {item.value && (
                    <div className="mt-2 rounded-md bg-gray-50 dark:bg-gray-800 px-3 py-2 font-mono text-xs text-gray-700 dark:text-gray-200">
                      {item.value}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
