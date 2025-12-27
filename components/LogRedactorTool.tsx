'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { LogRedactorError, LogRedactorResult, redactText } from '@/utils/logRedactor'

// Sample log block demonstrates redaction patterns.
const sampleLog = [
  '2025-01-10T09:41:12Z INFO user=test@example.com ip=192.168.0.10',
  'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZm9vIn0.signature',
  'Forwarded-For: 2001:0db8:85a3:0000:0000:8a2e:0370:7334',
].join('\n')

export default function LogRedactorTool() {
  const { t } = useLanguage()
  // Capture input/output and configuration flags for redaction.
  const [input, setInput] = useState('')
  const [result, setResult] = useState<LogRedactorResult | null>(null)
  const [error, setError] = useState('')

  const [maskEmail, setMaskEmail] = useState(true)
  const [maskIpv4, setMaskIpv4] = useState(true)
  const [maskIpv6, setMaskIpv6] = useState(true)
  const [maskJwt, setMaskJwt] = useState(true)
  const [useCustom, setUseCustom] = useState(false)
  const [customPattern, setCustomPattern] = useState('')
  const [customFlags, setCustomFlags] = useState('i')
  const [customLabel, setCustomLabel] = useState('')

  const handleRedact = () => {
    try {
      setError('')
      // Build options from the current UI state.
      const output = redactText(input, {
        maskEmail,
        maskIpv4,
        maskIpv6,
        maskJwt,
        customPattern: useCustom ? customPattern : undefined,
        customFlags: useCustom ? customFlags : undefined,
        customLabel: useCustom ? customLabel : undefined,
      })
      setResult(output)
    } catch (err) {
      setResult(null)
      if (err instanceof LogRedactorError) {
        setError(t('logRedactor.error.invalidRegex', { message: err.message }))
        return
      }
      setError(t('logRedactor.error.unknown'))
    }
  }

  const handleSample = () => {
    // Populate the input area with a sample log snippet.
    setInput(sampleLog)
    setResult(null)
    setError('')
  }

  const handleClear = () => {
    // Reset input, output, and errors for a clean slate.
    setInput('')
    setResult(null)
    setError('')
  }

  return (
    <ToolCard title={`🧹 ${t('logRedactor.title')}`} description={t('logRedactor.description')}>
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('logRedactor.input.label')}
          placeholder={t('logRedactor.input.placeholder')}
          rows={8}
        />

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {t('logRedactor.options.title')}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={maskEmail}
                onChange={(event) => setMaskEmail(event.target.checked)}
              />
              {t('logRedactor.options.email')}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={maskIpv4}
                onChange={(event) => setMaskIpv4(event.target.checked)}
              />
              {t('logRedactor.options.ipv4')}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={maskIpv6}
                onChange={(event) => setMaskIpv6(event.target.checked)}
              />
              {t('logRedactor.options.ipv6')}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={maskJwt}
                onChange={(event) => setMaskJwt(event.target.checked)}
              />
              {t('logRedactor.options.jwt')}
            </label>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={useCustom}
                onChange={(event) => setUseCustom(event.target.checked)}
              />
              {t('logRedactor.options.custom')}
            </label>
            {useCustom && (
              <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
                <input
                  value={customPattern}
                  onChange={(event) => setCustomPattern(event.target.value)}
                  placeholder={t('logRedactor.custom.patternPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  value={customFlags}
                  onChange={(event) => setCustomFlags(event.target.value)}
                  placeholder={t('logRedactor.custom.flagsPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  value={customLabel}
                  onChange={(event) => setCustomLabel(event.target.value)}
                  placeholder={t('logRedactor.custom.labelPlaceholder')}
                  className="md:col-span-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRedact}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('logRedactor.actions.redact')}
          </button>
          <button
            onClick={handleSample}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('logRedactor.actions.sample')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('logRedactor.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {t('logRedactor.stats.email', { count: result.counts.email })}
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {t('logRedactor.stats.ipv4', { count: result.counts.ipv4 })}
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {t('logRedactor.stats.ipv6', { count: result.counts.ipv6 })}
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {t('logRedactor.stats.jwt', { count: result.counts.jwt })}
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {t('logRedactor.stats.custom', { count: result.counts.custom })}
              </div>
            </div>

            <TextAreaWithCopy
              value={result.output}
              readOnly
              label={t('logRedactor.output.label')}
              placeholder={t('logRedactor.output.placeholder')}
              rows={8}
            />
          </div>
        )}
      </div>
    </ToolCard>
  )
}
