'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { calculateLatencyStats } from '@/utils/metrics'
import { buildCsv, parseHeaderLines, ResponseSample } from '@/utils/apiResponseTime'

// Provide a sensible default header set that works for JSON APIs.
const DEFAULT_HEADERS = `Accept: application/json\nCache-Control: no-cache`

export default function ApiResponseTimeTool() {
  const { t } = useLanguage()
  // Capture request settings in local state to allow repeatable test runs.
  const [url, setUrl] = useState('')
  const [method, setMethod] = useState('GET')
  const [headersText, setHeadersText] = useState(DEFAULT_HEADERS)
  const [bodyText, setBodyText] = useState('')
  const [runs, setRuns] = useState(5)
  const [delayMs, setDelayMs] = useState(0)
  const [timeoutMs, setTimeoutMs] = useState(8000)
  const [samples, setSamples] = useState<ResponseSample[]>([])
  const [error, setError] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const handleRun = async () => {
    // Validate required input before running the repeated requests.
    if (!url.trim()) {
      setError(t('apiResponse.error.required'))
      return
    }

    // Reset previous output so the new run always starts clean.
    setError('')
    setIsRunning(true)
    setSamples([])

    // Accumulate per-request timing data to feed the chart + CSV output.
    const results: ResponseSample[] = []
    const headers = parseHeaderLines(headersText)

    for (let i = 0; i < runs; i += 1) {
      // Create a new AbortController for each request so timeouts stay isolated.
      const controller = new AbortController()
      const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)
      const start = performance.now()

      try {
        // Build fetch options from the current form values.
        const init: RequestInit = {
          method,
          headers,
          mode: 'cors',
          signal: controller.signal,
        }

        // Only attach bodies to methods that support payloads.
        if (method !== 'GET' && method !== 'HEAD' && bodyText.trim()) {
          init.body = bodyText
        }

        // Read the response body to ensure the request fully completes.
        const response = await fetch(url, init)
        await response.text()
        const end = performance.now()

        results.push({
          index: i + 1,
          durationMs: end - start,
          status: response.status,
          ok: response.ok,
        })
      } catch (err) {
        const end = performance.now()
        const message = err instanceof Error ? err.message : t('apiResponse.error.unknown')

        results.push({
          index: i + 1,
          durationMs: end - start,
          ok: false,
          error: message,
        })
      } finally {
        clearTimeout(timeoutId)
      }

      if (delayMs > 0 && i < runs - 1) {
        // Delay between requests to avoid hammering the target service.
        await new Promise((resolve) => window.setTimeout(resolve, delayMs))
      }
    }

    // Store the completed results so the UI can render charts and stats.
    setSamples(results)
    setIsRunning(false)
  }

  const handleClear = () => {
    // Reset inputs and results back to the initial defaults.
    setUrl('')
    setMethod('GET')
    setHeadersText(DEFAULT_HEADERS)
    setBodyText('')
    setRuns(5)
    setDelayMs(0)
    setTimeoutMs(8000)
    setSamples([])
    setError('')
    setIsRunning(false)
  }

  // Filter successful requests for latency stats while keeping errors in the chart output.
  const okSamples = samples.filter((sample) => sample.ok)
  const stats = okSamples.length > 0 ? calculateLatencyStats(okSamples.map((sample) => sample.durationMs)) : null
  const maxDuration = samples.reduce((max, sample) => Math.max(max, sample.durationMs), 0)

  // Cache CSV output so it only rebuilds when new samples arrive.
  const csvOutput = useMemo(() => buildCsv(samples), [samples])

  return (
    <ToolCard
      title={`📈 ${t('apiResponse.title')}`}
      description={t('apiResponse.description')}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('apiResponse.input.url')}
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1/health"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('apiResponse.input.method')}
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
              <option value="HEAD">HEAD</option>
              <option value="OPTIONS">OPTIONS</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('apiResponse.input.runs')}
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={runs}
              onChange={(e) => setRuns(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('apiResponse.input.delay')}
            </label>
            <input
              type="number"
              min={0}
              max={10000}
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('apiResponse.input.timeout')}
            </label>
            <input
              type="number"
              min={1000}
              max={60000}
              value={timeoutMs}
              onChange={(e) => setTimeoutMs(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('apiResponse.input.headers')}
            </label>
            <textarea
              value={headersText}
              onChange={(e) => setHeadersText(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('apiResponse.input.body')}
          </label>
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder={t('apiResponse.input.bodyPlaceholder')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-xs"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {isRunning ? t('apiResponse.actions.running') : t('apiResponse.actions.run')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('apiResponse.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {samples.length > 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('apiResponse.chart.title')}
              </div>
              <div className="flex items-end gap-1 h-40 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                {samples.map((sample) => {
                  const heightPercent = maxDuration > 0 ? (sample.durationMs / maxDuration) * 100 : 0
                  const barHeight = Math.max(4, Math.round(heightPercent))
                  const barColor = sample.ok ? 'bg-blue-500' : 'bg-red-500'

                  return (
                    <div
                      key={sample.index}
                      title={`${sample.durationMs.toFixed(2)} ms`}
                      className={`flex-1 rounded ${barColor}`}
                      style={{ height: `${barHeight}%` }}
                    />
                  )
                })}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('apiResponse.chart.note')}
              </div>
            </div>

            {stats && (
              <div className="grid gap-3 md:grid-cols-2 text-sm">
                <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="text-gray-500 dark:text-gray-400">{t('apiResponse.stats.min')}</div>
                  <div className="font-mono text-gray-800 dark:text-gray-100">{stats.min.toFixed(2)} ms</div>
                </div>
                <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="text-gray-500 dark:text-gray-400">{t('apiResponse.stats.max')}</div>
                  <div className="font-mono text-gray-800 dark:text-gray-100">{stats.max.toFixed(2)} ms</div>
                </div>
                <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="text-gray-500 dark:text-gray-400">{t('apiResponse.stats.avg')}</div>
                  <div className="font-mono text-gray-800 dark:text-gray-100">{stats.avg.toFixed(2)} ms</div>
                </div>
                <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div className="text-gray-500 dark:text-gray-400">{t('apiResponse.stats.p95')}</div>
                  <div className="font-mono text-gray-800 dark:text-gray-100">{stats.p95.toFixed(2)} ms</div>
                </div>
              </div>
            )}

            <TextAreaWithCopy
              value={csvOutput}
              label={t('apiResponse.output.label')}
              placeholder={t('apiResponse.output.placeholder')}
              rows={6}
              readOnly
            />
          </div>
        )}
      </div>
    </ToolCard>
  )
}
