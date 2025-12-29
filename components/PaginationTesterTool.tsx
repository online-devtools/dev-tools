'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { parseHeaderLines } from '@/utils/apiResponseTime'

type PageSample = {
  index: number
  status?: number
  items: number
  duplicates: number
  cursor?: string
}

const getValueByPath = (data: any, path: string): any => {
  if (!path) return undefined
  const normalized = path.replace(/\[(\d+)\]/g, '.$1').replace(/^\./, '')
  return normalized.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), data)
}

export default function PaginationTesterTool() {
  const { t } = useLanguage()
  const [baseUrl, setBaseUrl] = useState('')
  const [mode, setMode] = useState<'page' | 'cursor'>('page')
  const [headersText, setHeadersText] = useState('')
  const [itemsPath, setItemsPath] = useState('items')
  const [idPath, setIdPath] = useState('id')
  const [cursorPath, setCursorPath] = useState('nextCursor')
  const [cursorParam, setCursorParam] = useState('cursor')
  const [pageParam, setPageParam] = useState('page')
  const [pageSizeParam, setPageSizeParam] = useState('per_page')
  const [pageSize, setPageSize] = useState(20)
  const [maxPages, setMaxPages] = useState(5)
  const [delayMs, setDelayMs] = useState(0)
  const [samples, setSamples] = useState<PageSample[]>([])
  const [error, setError] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const runTest = async () => {
    if (!baseUrl.trim()) {
      setError(t('pagination.error.url'))
      return
    }

    setError('')
    setIsRunning(true)
    setSamples([])

    const seenIds = new Set<string>()
    const headers = parseHeaderLines(headersText)
    const nextSamples: PageSample[] = []
    let cursor = ''

    for (let page = 0; page < maxPages; page += 1) {
      const url = new URL(baseUrl)
      if (mode === 'page') {
        url.searchParams.set(pageParam, String(page + 1))
        if (pageSizeParam) {
          url.searchParams.set(pageSizeParam, String(pageSize))
        }
      } else if (cursorParam) {
        if (cursor) {
          url.searchParams.set(cursorParam, cursor)
        }
      }

      try {
        const response = await fetch(url.toString(), { headers })
        const text = await response.text()
        let data: any = null
        try {
          data = JSON.parse(text)
        } catch {
          throw new Error(t('pagination.error.json'))
        }

        const items = getValueByPath(data, itemsPath)
        if (!Array.isArray(items)) {
          throw new Error(t('pagination.error.items'))
        }

        let duplicates = 0
        items.forEach((item) => {
          const idValue = idPath ? getValueByPath(item, idPath) : undefined
          const key = idValue !== undefined ? String(idValue) : JSON.stringify(item)
          if (seenIds.has(key)) {
            duplicates += 1
          } else {
            seenIds.add(key)
          }
        })

        const nextCursor = mode === 'cursor' ? getValueByPath(data, cursorPath) : undefined
        cursor = typeof nextCursor === 'string' ? nextCursor : cursor

        nextSamples.push({
          index: page + 1,
          status: response.status,
          items: items.length,
          duplicates,
          cursor: nextCursor ? String(nextCursor) : undefined,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : t('pagination.error.unknown'))
        break
      }

      if (delayMs > 0 && page < maxPages - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }

    setSamples(nextSamples)
    setIsRunning(false)
  }

  const report = useMemo(() => {
    if (!samples.length) return ''
    const totalItems = samples.reduce((sum, sample) => sum + sample.items, 0)
    const totalDuplicates = samples.reduce((sum, sample) => sum + sample.duplicates, 0)
    return [
      `Pages: ${samples.length}`,
      `Items: ${totalItems}`,
      `Duplicates: ${totalDuplicates}`,
    ].join('\n')
  }, [samples])

  return (
    <ToolCard title={`📄 ${t('pagination.title')}`} description={t('pagination.description')}>
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('pagination.url')}</label>
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://api.example.com/items"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode('page')}
            className={`px-3 py-2 rounded-lg ${mode === 'page' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {t('pagination.mode.page')}
          </button>
          <button
            onClick={() => setMode('cursor')}
            className={`px-3 py-2 rounded-lg ${mode === 'cursor' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {t('pagination.mode.cursor')}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('pagination.itemsPath')}</label>
            <input
              value={itemsPath}
              onChange={(e) => setItemsPath(e.target.value)}
              placeholder="items"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('pagination.idPath')}</label>
            <input
              value={idPath}
              onChange={(e) => setIdPath(e.target.value)}
              placeholder="id"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {mode === 'cursor' ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('pagination.cursorPath')}</label>
              <input
                value={cursorPath}
                onChange={(e) => setCursorPath(e.target.value)}
                placeholder="nextCursor"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('pagination.cursorParam')}</label>
              <input
                value={cursorParam}
                onChange={(e) => setCursorParam(e.target.value)}
                placeholder="cursor"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('pagination.pageParam')}</label>
              <input
                value={pageParam}
                onChange={(e) => setPageParam(e.target.value)}
                placeholder="page"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('pagination.pageSizeParam')}</label>
              <input
                value={pageSizeParam}
                onChange={(e) => setPageSizeParam(e.target.value)}
                placeholder="per_page"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('pagination.pageSize')}</label>
              <input
                type="number"
                min={1}
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('pagination.maxPages')}</label>
            <input
              type="number"
              min={1}
              value={maxPages}
              onChange={(e) => setMaxPages(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('pagination.delay')}</label>
            <input
              type="number"
              min={0}
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('pagination.headers')}</label>
          <textarea
            value={headersText}
            onChange={(e) => setHeadersText(e.target.value)}
            rows={3}
            placeholder="Authorization: Bearer ..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={runTest}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg"
          >
            {isRunning ? t('pagination.running') : t('pagination.run')}
          </button>
          <button
            onClick={() => {
              setSamples([])
              setError('')
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            {t('pagination.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {samples.length > 0 && (
          <div className="space-y-3">
            <div className="space-y-2">
              {samples.map((sample) => (
                <div key={sample.index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="text-sm text-gray-800 dark:text-gray-200">
                    {t('pagination.pageLabel', { index: sample.index })} · {sample.items} {t('pagination.items')} ·{' '}
                    {t('pagination.duplicates', { count: sample.duplicates })}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {sample.status ? `HTTP ${sample.status}` : ''} {sample.cursor ? `· cursor ${sample.cursor}` : ''}
                  </div>
                </div>
              ))}
            </div>
            <TextAreaWithCopy value={report} readOnly rows={4} />
          </div>
        )}
      </div>
    </ToolCard>
  )
}
