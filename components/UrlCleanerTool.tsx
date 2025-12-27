'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { UrlCleanerError, UrlCleanerResult, cleanUrl } from '@/utils/urlCleaner'

// Sample URL includes tracking params to demonstrate cleanup.
const sampleUrl =
  'https://example.com/page?utm_source=google&b=2&a=1&empty=&fbclid=123'

export default function UrlCleanerTool() {
  const { t } = useLanguage()
  // Store user input, options, and output summary.
  const [input, setInput] = useState('')
  const [removeTracking, setRemoveTracking] = useState(true)
  const [removeEmpty, setRemoveEmpty] = useState(true)
  const [sortQuery, setSortQuery] = useState(true)
  const [result, setResult] = useState<UrlCleanerResult | null>(null)
  const [error, setError] = useState('')

  const handleClean = () => {
    try {
      setError('')
      // Run the cleaner with the current option flags.
      const cleaned = cleanUrl(input, {
        removeTracking,
        removeEmpty,
        sortQuery,
      })
      setResult(cleaned)
    } catch (err) {
      setResult(null)
      if (err instanceof UrlCleanerError) {
        setError(t('urlCleaner.error.invalid'))
        return
      }
      setError(t('urlCleaner.error.unknown'))
    }
  }

  const handleSample = () => {
    // Populate the input with a sample URL.
    setInput(sampleUrl)
    setResult(null)
    setError('')
  }

  const handleClear = () => {
    // Reset the form to its initial state.
    setInput('')
    setResult(null)
    setError('')
  }

  return (
    <ToolCard
      title={`🧽 ${t('urlCleaner.title')}`}
      description={t('urlCleaner.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('urlCleaner.input.label')}
          placeholder={t('urlCleaner.input.placeholder')}
          rows={4}
        />

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {t('urlCleaner.options.title')}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={removeTracking}
                onChange={(event) => setRemoveTracking(event.target.checked)}
              />
              {t('urlCleaner.options.removeTracking')}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={removeEmpty}
                onChange={(event) => setRemoveEmpty(event.target.checked)}
              />
              {t('urlCleaner.options.removeEmpty')}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={sortQuery}
                onChange={(event) => setSortQuery(event.target.checked)}
              />
              {t('urlCleaner.options.sortQuery')}
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleClean}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('urlCleaner.actions.clean')}
          </button>
          <button
            onClick={handleSample}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('urlCleaner.actions.sample')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('urlCleaner.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <TextAreaWithCopy
              value={result.cleanedUrl}
              readOnly
              label={t('urlCleaner.output.label')}
              placeholder={t('urlCleaner.output.placeholder')}
              rows={4}
            />

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
              {t('urlCleaner.stats.removed', { count: result.removedParams.length })}
            </div>

            {result.removedParams.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.removedParams.map((param, index) => (
                  <span
                    key={`${param}-${index}`}
                    className="rounded-full bg-gray-200 dark:bg-gray-700 px-3 py-1 text-xs text-gray-700 dark:text-gray-200"
                  >
                    {param}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
