'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { JsonPathError, JsonPathEntry, listJsonPaths } from '@/utils/jsonPath'

export default function JSONPathFinderTool() {
  const { t } = useLanguage()
  // Store raw JSON input, search query, and parsed path list.
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [paths, setPaths] = useState<JsonPathEntry[]>([])
  const [error, setError] = useState('')

  const filteredPaths = useMemo(() => {
    // Filter by JSONPath or value string for quick lookup.
    if (!query.trim()) return paths
    const needle = query.toLowerCase()
    return paths.filter((entry) => {
      const valueText = entry.value === null ? 'null' : String(entry.value)
      return entry.path.toLowerCase().includes(needle) || valueText.toLowerCase().includes(needle)
    })
  }, [paths, query])

  const handleAnalyze = () => {
    try {
      setError('')
      // Parse JSON into a list of JSONPath entries for display.
      const entries = listJsonPaths(input)
      setPaths(entries)
    } catch (err) {
      if (err instanceof JsonPathError) {
        if (err.code === 'empty') {
          setError(t('jsonPath.error.empty'))
        } else {
          setError(t('jsonPath.error.invalidJson'))
        }
      } else {
        setError(t('jsonPath.error.unknown'))
      }
      setPaths([])
    }
  }

  const handleClear = () => {
    // Reset all fields to start a fresh JSONPath lookup.
    setInput('')
    setQuery('')
    setPaths([])
    setError('')
  }

  const handleCopy = (text: string) => {
    // Copy a JSONPath value to clipboard for quick reuse.
    navigator.clipboard.writeText(text)
  }

  return (
    <ToolCard
      title={`🧭 ${t('jsonPath.title')}`}
      description={t('jsonPath.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('jsonPath.input.label')}
          placeholder={t('jsonPath.input.placeholder')}
          rows={10}
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAnalyze}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('jsonPath.actions.analyze')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('jsonPath.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('jsonPath.filter.label')}
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('jsonPath.filter.placeholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300">
          {t('jsonPath.stats.label', { count: filteredPaths.length })}
        </div>

        <div className="space-y-2">
          {filteredPaths.length === 0 && !error && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('jsonPath.results.empty')}
            </div>
          )}
          {filteredPaths.map((entry) => (
            <div
              key={entry.path}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex-1">
                <div className="font-mono text-sm text-gray-800 dark:text-gray-100">
                  {entry.path}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {entry.value === null ? 'null' : String(entry.value)}
                </div>
              </div>
              <button
                onClick={() => handleCopy(entry.path)}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors"
              >
                {t('jsonPath.actions.copy')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToolCard>
  )
}
