'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  CookieParserError,
  parseCookieHeader,
  toCookieHeaderFromJson,
  toCookieJsonString,
} from '@/utils/cookieParser'

type CookieStats = {
  count: number
  modeLabel: string
}

export default function CookieParserTool() {
  const { t } = useLanguage()
  // Keep input/output state in sync with conversion actions.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState<CookieStats | null>(null)

  const formatError = (err: unknown): string => {
    // Convert structured errors into localized messages.
    if (err instanceof CookieParserError) {
      if (err.code === 'empty') {
        return t('cookieParser.error.empty')
      }
      if (err.code === 'invalidPair') {
        return t('cookieParser.error.invalidPair')
      }
      if (err.code === 'invalidJson') {
        return t('cookieParser.error.invalidJson')
      }
      if (err.code === 'notObject') {
        return t('cookieParser.error.notObject')
      }
    }
    return t('cookieParser.error.unknown')
  }

  const handleParse = () => {
    try {
      setError('')
      // Parse the Cookie header and output a formatted JSON string.
      const cookies = parseCookieHeader(input)
      const outputValue = toCookieJsonString(input)

      setOutput(outputValue)
      setStats({
        count: Object.keys(cookies).length,
        modeLabel: t('cookieParser.stats.parsed'),
      })
    } catch (err) {
      setError(formatError(err))
      setOutput('')
      setStats(null)
    }
  }

  const handleBuild = () => {
    try {
      setError('')
      // Convert JSON into a Cookie header and recompute stats from the header output.
      const outputValue = toCookieHeaderFromJson(input)
      const cookies = parseCookieHeader(outputValue)

      setOutput(outputValue)
      setStats({
        count: Object.keys(cookies).length,
        modeLabel: t('cookieParser.stats.built'),
      })
    } catch (err) {
      setError(formatError(err))
      setOutput('')
      setStats(null)
    }
  }

  const handleClear = () => {
    // Clear all state so the next conversion starts from a clean slate.
    setInput('')
    setOutput('')
    setError('')
    setStats(null)
  }

  return (
    <ToolCard
      title={`🍪 ${t('cookieParser.title')}`}
      description={t('cookieParser.description')}
    >
      <div className="space-y-4">
        {/* Input accepts either a Cookie header or a JSON object string. */}
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('cookieParser.input.label')}
          placeholder={t('cookieParser.input.placeholder')}
          rows={8}
        />

        {/* Action buttons let users switch between parse/build flows. */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleParse}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('cookieParser.actions.parse')}
          </button>
          <button
            onClick={handleBuild}
            className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('cookieParser.actions.build')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('cookieParser.actions.clear')}
          </button>
        </div>

        {/* Display parsing/validation errors in a consistent alert block. */}
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Stats call out how many cookies were parsed or built. */}
        {stats && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('cookieParser.stats.label', { count: stats.count, mode: stats.modeLabel })}
          </div>
        )}

        {/* Output is read-only so the conversion result is preserved. */}
        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('cookieParser.output.label')}
          placeholder={t('cookieParser.output.placeholder')}
          rows={8}
        />
      </div>
    </ToolCard>
  )
}
