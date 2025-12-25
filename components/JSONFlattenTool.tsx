'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  JsonFlattenError,
  flattenJson,
  toFlattenedJsonString,
  toNestedJsonString,
  unflattenJson,
} from '@/utils/jsonFlatten'

type FlattenStats = {
  count: number
  modeLabel: string
}

export default function JSONFlattenTool() {
  const { t } = useLanguage()
  // Manage input/output and state so each action stays predictable.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [stats, setStats] = useState<FlattenStats | null>(null)

  const formatError = (err: unknown): string => {
    // Map error codes to localized strings for user-friendly feedback.
    if (err instanceof JsonFlattenError) {
      if (err.code === 'empty') {
        return t('jsonFlatten.error.empty')
      }
      if (err.code === 'invalidJson') {
        return t('jsonFlatten.error.invalidJson')
      }
      if (err.code === 'notObject') {
        return t('jsonFlatten.error.notObject')
      }
      if (err.code === 'invalidPath') {
        return t('jsonFlatten.error.invalidPath')
      }
    }
    return t('jsonFlatten.error.unknown')
  }

  const handleFlatten = () => {
    try {
      setError('')
      // Flatten the JSON structure and capture both the output and stats.
      const flattened = flattenJson(input)
      const outputValue = toFlattenedJsonString(input)

      setOutput(outputValue)
      setStats({
        count: Object.keys(flattened).length,
        modeLabel: t('jsonFlatten.stats.flatten'),
      })
    } catch (err) {
      setError(formatError(err))
      setOutput('')
      setStats(null)
    }
  }

  const handleUnflatten = () => {
    try {
      setError('')
      // Expand a flattened map back into nested JSON and compute a top-level count.
      const nested = unflattenJson(input)
      const outputValue = toNestedJsonString(input)
      const count = Array.isArray(nested)
        ? nested.length
        : nested && typeof nested === 'object'
          ? Object.keys(nested).length
          : 0

      setOutput(outputValue)
      setStats({
        count,
        modeLabel: t('jsonFlatten.stats.unflatten'),
      })
    } catch (err) {
      setError(formatError(err))
      setOutput('')
      setStats(null)
    }
  }

  const handleClear = () => {
    // Reset all state values so the tool returns to its initial state.
    setInput('')
    setOutput('')
    setError('')
    setStats(null)
  }

  return (
    <ToolCard
      title={`🧩 ${t('jsonFlatten.title')}`}
      description={t('jsonFlatten.description')}
    >
      <div className="space-y-4">
        {/* Input textarea supports both nested JSON and flattened JSON strings. */}
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('jsonFlatten.input.label')}
          placeholder={t('jsonFlatten.input.placeholder')}
          rows={10}
        />

        {/* Action buttons map directly to flatten/unflatten/clear handlers. */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleFlatten}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('jsonFlatten.actions.flatten')}
          </button>
          <button
            onClick={handleUnflatten}
            className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('jsonFlatten.actions.unflatten')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('jsonFlatten.actions.clear')}
          </button>
        </div>

        {/* Error feedback stays visible between conversions. */}
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Stats communicate how many keys were produced/expanded. */}
        {stats && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('jsonFlatten.stats.label', { count: stats.count, mode: stats.modeLabel })}
          </div>
        )}

        {/* Output textarea is read-only and supports quick copying. */}
        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('jsonFlatten.output.label')}
          placeholder={t('jsonFlatten.output.placeholder')}
          rows={10}
        />
      </div>
    </ToolCard>
  )
}
