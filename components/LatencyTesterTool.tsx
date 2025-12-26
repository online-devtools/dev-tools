'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'
import { calculateLatencyStats } from '@/utils/metrics'

export default function LatencyTesterTool() {
  const { t } = useLanguage()
  // Store URL, request count, and latency results.
  const [url, setUrl] = useState('')
  const [method, setMethod] = useState('HEAD')
  const [count, setCount] = useState(5)
  const [latencies, setLatencies] = useState<number[]>([])
  const [failures, setFailures] = useState(0)
  const [error, setError] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const handleRun = async () => {
    if (!url.trim()) {
      setError(t('latency.error.required'))
      return
    }

    setError('')
    setIsRunning(true)
    setLatencies([])
    setFailures(0)

    const results: number[] = []
    let failed = 0

    // Run requests sequentially to keep timing results accurate.
    for (let i = 0; i < count; i += 1) {
      try {
        const start = performance.now()
        await fetch(url, { method, mode: 'cors' })
        const end = performance.now()
        results.push(end - start)
      } catch (err) {
        failed += 1
      }
    }

    setLatencies(results)
    setFailures(failed)
    setIsRunning(false)
  }

  const handleClear = () => {
    // Reset the test inputs and results.
    setUrl('')
    setMethod('HEAD')
    setCount(5)
    setLatencies([])
    setFailures(0)
    setError('')
    setIsRunning(false)
  }

  const stats = latencies.length > 0 ? calculateLatencyStats(latencies) : null

  return (
    <ToolCard
      title={`📶 ${t('latency.title')}`}
      description={t('latency.description')}
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('latency.input.url')}
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/health"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('latency.input.method')}
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="HEAD">HEAD</option>
            <option value="GET">GET</option>
          </select>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('latency.input.count')}
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {isRunning ? t('latency.actions.running') : t('latency.actions.run')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('latency.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {stats && (
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="text-gray-500 dark:text-gray-400">{t('latency.stats.min')}</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">{stats.min.toFixed(2)} ms</div>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="text-gray-500 dark:text-gray-400">{t('latency.stats.max')}</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">{stats.max.toFixed(2)} ms</div>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="text-gray-500 dark:text-gray-400">{t('latency.stats.avg')}</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">{stats.avg.toFixed(2)} ms</div>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="text-gray-500 dark:text-gray-400">{t('latency.stats.p95')}</div>
              <div className="font-mono text-gray-800 dark:text-gray-100">{stats.p95.toFixed(2)} ms</div>
            </div>
          </div>
        )}

        {latencies.length > 0 && (
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div>{t('latency.stats.runs', { count: latencies.length, failures })}</div>
            <div className="flex flex-wrap gap-2">
              {latencies.map((value, index) => (
                <span key={`${value}-${index}`} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                  {value.toFixed(1)} ms
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
