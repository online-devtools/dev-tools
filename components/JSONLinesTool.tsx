'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  JsonLinesError,
  parseJsonArray,
  parseJsonLines,
  toJsonArrayString,
  toJsonLinesString,
} from '@/utils/jsonLines'

interface JsonLinesStats {
  recordCount: number
  sourceLabel: string
}

export default function JSONLinesTool() {
  const { t } = useLanguage()
  // Track user input, output, and error status to keep conversions and messages in sync.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState<JsonLinesStats | null>(null)

  const formatError = (err: unknown): string => {
    if (err instanceof JsonLinesError) {
      if (err.code === 'empty') {
        return t('jsonLines.error.empty')
      }
      if (err.code === 'invalidLine') {
        return t('jsonLines.error.invalidLine', { line: err.line ?? '-', message: err.message })
      }
      if (err.code === 'notArray') {
        return t('jsonLines.error.notArray')
      }
      if (err.code === 'stringify') {
        return t('jsonLines.error.stringify')
      }
    }
    return t('jsonLines.error.unknown')
  }

  const handleLinesToArray = () => {
    try {
      setError('')
      // Parse JSONL to validate each line, then build a pretty JSON array string.
      const records = parseJsonLines(input)
      const outputValue = toJsonArrayString(input)

      setOutput(outputValue)
      setStats({ recordCount: records.length, sourceLabel: t('jsonLines.stats.lines') })
    } catch (err) {
      setError(formatError(err))
      setOutput('')
      setStats(null)
    }
  }

  const handleArrayToLines = () => {
    try {
      setError('')
      // Parse the JSON array first to surface validation errors before converting to JSONL.
      const records = parseJsonArray(input)
      const outputValue = toJsonLinesString(input)

      setOutput(outputValue)
      setStats({ recordCount: records.length, sourceLabel: t('jsonLines.stats.items') })
    } catch (err) {
      setError(formatError(err))
      setOutput('')
      setStats(null)
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setStats(null)
  }

  return (
    <ToolCard
      title={`🧾 ${t('jsonLines.title')}`}
      description={t('jsonLines.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('jsonLines.input.label')}
          placeholder={t('jsonLines.input.placeholder')}
          rows={10}
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleLinesToArray}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('jsonLines.actions.linesToArray')}
          </button>
          <button
            onClick={handleArrayToLines}
            className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('jsonLines.actions.arrayToLines')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('jsonLines.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {stats && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('jsonLines.stats.label', { count: stats.recordCount, source: stats.sourceLabel })}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('jsonLines.output.label')}
          placeholder={t('jsonLines.output.placeholder')}
          rows={10}
        />
      </div>
    </ToolCard>
  )
}
