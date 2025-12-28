'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  CertChainError,
  CertChainResult,
  inspectCertificateChain,
} from '@/utils/certChainInspector'

// Sample certificate chain using minimal payloads for offline testing.
const sampleChain = [
  '-----BEGIN CERTIFICATE-----',
  'AQID',
  '-----END CERTIFICATE-----',
  '-----BEGIN CERTIFICATE-----',
  'BAUGBwgJ',
  '-----END CERTIFICATE-----',
].join('\n')

export default function CertChainInspectorTool() {
  const { t } = useLanguage()
  // Track input, output, loading, and error state for async inspection.
  const [input, setInput] = useState('')
  const [result, setResult] = useState<CertChainResult | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInspect = async () => {
    setIsLoading(true)
    setError('')
    try {
      const output = await inspectCertificateChain(input)
      setResult(output)
    } catch (err) {
      setResult(null)
      if (err instanceof CertChainError) {
        if (err.code === 'noCertificates') {
          setError(t('certChain.error.none'))
          return
        }
        if (err.code === 'invalidCertificate') {
          setError(t('certChain.error.invalid'))
          return
        }
        if (err.code === 'cryptoUnavailable') {
          setError(t('certChain.error.crypto'))
          return
        }
      }
      setError(t('certChain.error.unknown'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSample = () => {
    // Load a sample chain and clear prior results.
    setInput(sampleChain)
    setResult(null)
    setError('')
  }

  const handleClear = () => {
    // Clear all fields so the user can paste a fresh chain.
    setInput('')
    setResult(null)
    setError('')
  }

  return (
    <ToolCard
      title={`🔐 ${t('certChain.title')}`}
      description={t('certChain.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('certChain.input.label')}
          placeholder={t('certChain.input.placeholder')}
          rows={10}
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleInspect}
            disabled={isLoading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg font-medium transition-colors"
          >
            {isLoading ? t('certChain.actions.loading') : t('certChain.actions.inspect')}
          </button>
          <button
            onClick={handleSample}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('certChain.actions.sample')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('certChain.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {t('certChain.summary.total', { count: result.summary.total })}
              </div>
              <div className="rounded-lg border border-yellow-200 dark:border-yellow-900/40 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-200">
                {t('certChain.summary.duplicates', { count: result.summary.duplicates })}
              </div>
            </div>

            {result.warnings.length > 0 && (
              <div className="rounded-lg border border-yellow-200 dark:border-yellow-900/40 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-3 text-sm text-yellow-800 dark:text-yellow-200">
                <div className="font-semibold">{t('certChain.warnings.title')}</div>
                <ul className="mt-2 space-y-1">
                  {result.warnings.map((warning, index) => (
                    <li key={`${warning}-${index}`}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              {result.certificates.map((cert) => (
                <div
                  key={`${cert.index}-${cert.fingerprintSha256}`}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {t('certChain.certificate.title', { index: cert.index + 1 })}
                    </div>
                    {cert.isDuplicate && (
                      <span className="rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200 px-2 py-0.5 text-xs font-semibold">
                        {t('certChain.certificate.duplicate')}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {t('certChain.certificate.size', { count: cert.derSize })}
                  </div>
                  <div className="mt-2 rounded-md bg-gray-50 dark:bg-gray-900 px-3 py-2 font-mono text-xs text-gray-700 dark:text-gray-200 break-all">
                    {cert.fingerprintSha256}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
