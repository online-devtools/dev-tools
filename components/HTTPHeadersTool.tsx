'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  HttpHeadersError,
  parseHeadersBlock,
  toHeadersBlockFromJson,
  toHeadersJsonString,
} from '@/utils/httpHeaders'

export default function HTTPHeadersTool() {
  const { t } = useLanguage()
  // Store user input and output so each conversion button can re-run with the latest values.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [count, setCount] = useState<number | null>(null)

  const formatError = (err: unknown): string => {
    if (err instanceof HttpHeadersError) {
      if (err.code === 'empty') {
        return t('httpHeaders.error.empty')
      }
      if (err.code === 'invalidLine') {
        return t('httpHeaders.error.invalidLine', { line: err.line ?? '-', message: err.message })
      }
      if (err.code === 'invalidJson') {
        return t('httpHeaders.error.invalidJson', { message: err.message })
      }
      if (err.code === 'notObject') {
        return t('httpHeaders.error.notObject')
      }
      if (err.code === 'invalidValue') {
        return t('httpHeaders.error.invalidValue')
      }
    }
    return t('httpHeaders.error.unknown')
  }

  const handleHeadersToJson = () => {
    try {
      setError('')
      // Parse header lines into a normalized object so duplicate headers are preserved.
      const parsed = parseHeadersBlock(input)
      const outputValue = toHeadersJsonString(input)

      setOutput(outputValue)
      setCount(Object.keys(parsed).length)
    } catch (err) {
      setError(formatError(err))
      setOutput('')
      setCount(null)
    }
  }

  const handleJsonToHeaders = () => {
    try {
      setError('')
      // Convert a JSON object into a header block, expanding arrays into repeated headers.
      const outputValue = toHeadersBlockFromJson(input)

      setOutput(outputValue)
      setCount(outputValue ? outputValue.split('\n').length : 0)
    } catch (err) {
      setError(formatError(err))
      setOutput('')
      setCount(null)
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setCount(null)
  }

  return (
    <ToolCard
      title={`📨 ${t('httpHeaders.title')}`}
      description={t('httpHeaders.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('httpHeaders.input.label')}
          placeholder={t('httpHeaders.input.placeholder')}
          rows={10}
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleHeadersToJson}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('httpHeaders.actions.headersToJson')}
          </button>
          <button
            onClick={handleJsonToHeaders}
            className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('httpHeaders.actions.jsonToHeaders')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('httpHeaders.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {count !== null && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('httpHeaders.stats.count', { count })}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('httpHeaders.output.label')}
          placeholder={t('httpHeaders.output.placeholder')}
          rows={10}
        />
      </div>
    </ToolCard>
  )
}
