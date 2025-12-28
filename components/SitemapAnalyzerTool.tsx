'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  analyzeSitemapXml,
  SitemapAnalysis,
  SitemapAnalyzerError,
} from '@/utils/sitemapAnalyzer'

// Sample sitemap XML for quick validation of the analyzer output.
const sampleSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-01</lastmod>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2024-01-02</lastmod>
  </url>
  <url>
    <loc>https://example.com/about</loc>
  </url>
</urlset>`

export default function SitemapAnalyzerTool() {
  const { t } = useLanguage()
  // Track input, analysis, and error states for the UI.
  const [input, setInput] = useState('')
  const [analysis, setAnalysis] = useState<SitemapAnalysis | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = () => {
    try {
      setError('')
      const result = analyzeSitemapXml(input)
      setAnalysis(result)
    } catch (err) {
      setAnalysis(null)
      if (err instanceof SitemapAnalyzerError) {
        if (err.code === 'emptyInput') {
          setError(t('sitemapAnalyzer.error.empty'))
          return
        }
        if (err.code === 'invalidXml') {
          setError(t('sitemapAnalyzer.error.invalidXml'))
          return
        }
        if (err.code === 'unsupportedFormat') {
          setError(t('sitemapAnalyzer.error.unsupported'))
          return
        }
      }
      setError(t('sitemapAnalyzer.error.unknown'))
    }
  }

  const handleSample = () => {
    // Seed the input and clear previous output for a clean preview.
    setInput(sampleSitemap)
    setAnalysis(null)
    setError('')
  }

  const handleClear = () => {
    // Reset input and output fields for a new analysis.
    setInput('')
    setAnalysis(null)
    setError('')
  }

  return (
    <ToolCard
      title={`🧭 ${t('sitemapAnalyzer.title')}`}
      description={t('sitemapAnalyzer.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('sitemapAnalyzer.input.label')}
          placeholder={t('sitemapAnalyzer.input.placeholder')}
          rows={12}
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAnalyze}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('sitemapAnalyzer.actions.analyze')}
          </button>
          <button
            onClick={handleSample}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('sitemapAnalyzer.actions.sample')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('sitemapAnalyzer.actions.clear')}
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
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {t('sitemapAnalyzer.summary.total', { count: analysis.summary.total })}
              </div>
              <div className="rounded-lg border border-yellow-200 dark:border-yellow-900/40 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-200">
                {t('sitemapAnalyzer.summary.duplicates', { count: analysis.summary.duplicates })}
              </div>
              <div className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-200">
                {t('sitemapAnalyzer.summary.missingLastmod', { count: analysis.summary.missingLastmod })}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
              {t('sitemapAnalyzer.summary.type')}: {t(`sitemapAnalyzer.type.${analysis.type}`)}
            </div>

            {analysis.warnings.length > 0 && (
              <div className="rounded-lg border border-yellow-200 dark:border-yellow-900/40 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-3 text-sm text-yellow-800 dark:text-yellow-200">
                <div className="font-semibold">{t('sitemapAnalyzer.warnings.title')}</div>
                <ul className="mt-2 space-y-1">
                  {analysis.warnings.map((warning, index) => (
                    <li key={`${warning}-${index}`}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              {analysis.entries.map((entry, index) => (
                <div
                  key={`${entry.loc}-${index}`}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3"
                >
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {entry.loc || t('sitemapAnalyzer.entry.missingLoc')}
                  </div>
                  <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                    {entry.lastmod
                      ? t('sitemapAnalyzer.entry.lastmod', { value: entry.lastmod })
                      : t('sitemapAnalyzer.entry.noLastmod')}
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
