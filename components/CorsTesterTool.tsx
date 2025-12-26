"use client"

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type CorsResult = {
  status: number
  statusText: string
  allowOrigin?: string
  allowMethods?: string
  allowHeaders?: string
}

const parseHeaders = (input: string): Record<string, string> => {
  // Parse "Header: value" lines into an object for fetch().
  const headers: Record<string, string> = {}
  input.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) return
    const index = trimmed.indexOf(':')
    if (index === -1) return
    const key = trimmed.slice(0, index).trim()
    const value = trimmed.slice(index + 1).trim()
    headers[key] = value
  })
  return headers
}

export default function CorsTesterTool() {
  const { t } = useLanguage()
  // Store URL, method, headers, and results for the CORS probe.
  const [url, setUrl] = useState('')
  const [method, setMethod] = useState('GET')
  const [headersInput, setHeadersInput] = useState('')
  const [result, setResult] = useState<CorsResult | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleTest = async () => {
    try {
      setError('')
      setIsLoading(true)
      setResult(null)

      if (!url.trim()) {
        setError(t('cors.error.required'))
        return
      }

      const headers = parseHeaders(headersInput)
      const response = await fetch(url, {
        method,
        mode: 'cors',
        headers,
      })

      const allowOrigin = response.headers.get('access-control-allow-origin') ?? undefined
      const allowMethods = response.headers.get('access-control-allow-methods') ?? undefined
      const allowHeaders = response.headers.get('access-control-allow-headers') ?? undefined

      setResult({
        status: response.status,
        statusText: response.statusText,
        allowOrigin,
        allowMethods,
        allowHeaders,
      })
    } catch (err) {
      setError(t('cors.error.failed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    // Reset all fields for a fresh CORS check.
    setUrl('')
    setMethod('GET')
    setHeadersInput('')
    setResult(null)
    setError('')
  }

  return (
    <ToolCard
      title={`🌐 ${t('cors.title')}`}
      description={t('cors.description')}
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('cors.input.url')}
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/resource"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('cors.input.method')}
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="GET">GET</option>
            <option value="HEAD">HEAD</option>
            <option value="POST">POST</option>
          </select>
        </div>

        <TextAreaWithCopy
          value={headersInput}
          onChange={setHeadersInput}
          label={t('cors.input.headers')}
          placeholder={t('cors.input.headersPlaceholder')}
          rows={4}
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleTest}
            disabled={isLoading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {isLoading ? t('cors.actions.testing') : t('cors.actions.test')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('cors.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="text-gray-500 dark:text-gray-400">{t('cors.result.status')}</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">
                {result.status} {result.statusText}
              </div>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="text-gray-500 dark:text-gray-400">{t('cors.result.allowOrigin')}</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">{result.allowOrigin ?? '-'}</div>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="text-gray-500 dark:text-gray-400">{t('cors.result.allowMethods')}</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">{result.allowMethods ?? '-'}</div>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="text-gray-500 dark:text-gray-400">{t('cors.result.allowHeaders')}</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">{result.allowHeaders ?? '-'}</div>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
