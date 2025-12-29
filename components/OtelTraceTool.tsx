'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type SpanNode = {
  id: string
  parentId?: string
  name: string
  startTimeMs: number
  durationMs: number
  service?: string
  kind?: string
  attributes?: Record<string, string>
  depth?: number
}

type TraceSummary = {
  totalSpans: number
  rootCount: number
  totalDurationMs: number
  longestSpan?: SpanNode
}

const SPAN_KIND_MAP: Record<number, string> = {
  1: 'INTERNAL',
  2: 'SERVER',
  3: 'CLIENT',
  4: 'PRODUCER',
  5: 'CONSUMER',
}

const safeJsonParse = (value: string): { ok: boolean; data?: unknown; error?: string } => {
  try {
    return { ok: true, data: JSON.parse(value) }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Invalid JSON' }
  }
}

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value)
  return 0
}

const toMsFromNano = (value: unknown): number => {
  const num = toNumber(value)
  return num / 1_000_000
}

const toMsFromMicro = (value: unknown): number => {
  const num = toNumber(value)
  return num / 1_000
}

const extractAttributes = (attributes: Array<{ key: string; value: Record<string, unknown> }> | undefined) => {
  if (!attributes) return undefined
  const result: Record<string, string> = {}
  attributes.forEach((attr) => {
    const value = Object.values(attr.value || {})[0]
    if (value !== undefined) {
      result[attr.key] = String(value)
    }
  })
  return Object.keys(result).length > 0 ? result : undefined
}

const flattenOtlp = (data: any): SpanNode[] => {
  const spans: SpanNode[] = []
  const resourceSpans = Array.isArray(data?.resourceSpans) ? data.resourceSpans : []

  resourceSpans.forEach((resourceSpan: any) => {
    const attributes = extractAttributes(resourceSpan?.resource?.attributes)
    const serviceName = attributes?.['service.name']
    const scopeSpans = Array.isArray(resourceSpan?.scopeSpans) ? resourceSpan.scopeSpans : []

    scopeSpans.forEach((scopeSpan: any) => {
      const otlpSpans = Array.isArray(scopeSpan?.spans) ? scopeSpan.spans : []
      otlpSpans.forEach((span: any) => {
        const start = toMsFromNano(span.startTimeUnixNano)
        const end = toMsFromNano(span.endTimeUnixNano)
        spans.push({
          id: span.spanId,
          parentId: span.parentSpanId || undefined,
          name: span.name || 'unknown',
          startTimeMs: start,
          durationMs: Math.max(end - start, 0),
          service: serviceName,
          kind: SPAN_KIND_MAP[span.kind] || 'UNKNOWN',
          attributes: extractAttributes(span.attributes),
        })
      })
    })
  })

  return spans
}

const flattenJaeger = (data: any): SpanNode[] => {
  const spans: SpanNode[] = []
  const entries = Array.isArray(data?.data) ? data.data : []

  entries.forEach((entry: any) => {
    const processes = entry?.processes || {}
    const spanList = Array.isArray(entry?.spans) ? entry.spans : []

    spanList.forEach((span: any) => {
      const references = Array.isArray(span.references) ? span.references : []
      const parentRef = references.find((ref: any) => ref.refType === 'CHILD_OF')
      const start = toMsFromMicro(span.startTime)
      const duration = toMsFromMicro(span.duration)
      const process = span.processID ? processes[span.processID] : undefined

      spans.push({
        id: span.spanID,
        parentId: parentRef?.spanID,
        name: span.operationName || 'unknown',
        startTimeMs: start,
        durationMs: duration,
        service: process?.serviceName,
      })
    })
  })

  return spans
}

const flattenZipkin = (data: any): SpanNode[] => {
  const spans: SpanNode[] = []
  const spanList = Array.isArray(data) ? data : []
  spanList.forEach((span: any) => {
    const start = toMsFromMicro(span.timestamp)
    const duration = toMsFromMicro(span.duration)
    spans.push({
      id: span.id,
      parentId: span.parentId,
      name: span.name || 'unknown',
      startTimeMs: start,
      durationMs: duration,
      service: span.localEndpoint?.serviceName,
      kind: span.kind,
      attributes: span.tags,
    })
  })
  return spans
}

const buildTree = (spans: SpanNode[]): SpanNode[] => {
  const byId = new Map<string, SpanNode>()
  spans.forEach((span) => {
    byId.set(span.id, { ...span })
  })

  const roots: SpanNode[] = []
  byId.forEach((span) => {
    if (span.parentId && byId.has(span.parentId)) {
      return
    }
    roots.push(span)
  })

  const assignDepth = (node: SpanNode, depth: number) => {
    node.depth = depth
    const children = spans.filter((span) => span.parentId === node.id)
    children.sort((a, b) => a.startTimeMs - b.startTimeMs)
    children.forEach((child) => {
      const childNode = byId.get(child.id)
      if (childNode) {
        assignDepth(childNode, depth + 1)
      }
    })
  }

  roots.sort((a, b) => a.startTimeMs - b.startTimeMs)
  roots.forEach((root) => {
    const rootNode = byId.get(root.id)
    if (rootNode) {
      assignDepth(rootNode, 0)
    }
  })

  return Array.from(byId.values()).sort((a, b) => a.startTimeMs - b.startTimeMs)
}

const summarizeTrace = (spans: SpanNode[]): TraceSummary => {
  if (spans.length === 0) {
    return { totalSpans: 0, rootCount: 0, totalDurationMs: 0 }
  }

  const minStart = Math.min(...spans.map((span) => span.startTimeMs))
  const maxEnd = Math.max(...spans.map((span) => span.startTimeMs + span.durationMs))
  const roots = spans.filter((span) => !span.parentId)
  const longestSpan = spans.reduce((max, span) => (span.durationMs > max.durationMs ? span : max), spans[0])

  return {
    totalSpans: spans.length,
    rootCount: roots.length,
    totalDurationMs: Math.max(maxEnd - minStart, 0),
    longestSpan,
  }
}

export default function OtelTraceTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [spans, setSpans] = useState<SpanNode[]>([])
  const [summary, setSummary] = useState<TraceSummary | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = () => {
    const parsed = safeJsonParse(input)
    if (!parsed.ok || parsed.data === undefined) {
      setError(t('otelTrace.error.json'))
      setSpans([])
      setSummary(null)
      return
    }

    const data = parsed.data as any
    let flat: SpanNode[] = []

    if (Array.isArray(data)) {
      flat = flattenZipkin(data)
    } else if (data?.resourceSpans) {
      flat = flattenOtlp(data)
    } else if (data?.data) {
      flat = flattenJaeger(data)
    }

    if (flat.length === 0) {
      setError(t('otelTrace.error.format'))
      setSpans([])
      setSummary(null)
      return
    }

    const withDepth = buildTree(flat)
    setSpans(withDepth)
    setSummary(summarizeTrace(withDepth))
    setError('')
  }

  const slowest = summary?.longestSpan

  const reportText = useMemo(() => {
    if (!summary) return ''
    return [
      `Total spans: ${summary.totalSpans}`,
      `Root spans: ${summary.rootCount}`,
      `Trace duration: ${summary.totalDurationMs.toFixed(1)}ms`,
      slowest ? `Slowest span: ${slowest.name} (${slowest.durationMs.toFixed(1)}ms)` : 'Slowest span: -',
    ].join('\n')
  }, [summary, slowest])

  return (
    <ToolCard title={`🧵 ${t('otelTrace.title')}`} description={t('otelTrace.description')}>
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('otelTrace.input')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder={t('otelTrace.placeholder')}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAnalyze}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            {t('otelTrace.analyze')}
          </button>
          <button
            onClick={() => {
              setInput('')
              setSpans([])
              setSummary(null)
              setError('')
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            {t('otelTrace.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {summary && (
          <div className="grid gap-3 md:grid-cols-3">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">{t('otelTrace.summary.spans')}</div>
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">{summary.totalSpans}</div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">{t('otelTrace.summary.duration')}</div>
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {summary.totalDurationMs.toFixed(1)}ms
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">{t('otelTrace.summary.slowest')}</div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {slowest ? `${slowest.name} (${slowest.durationMs.toFixed(1)}ms)` : '-'}
              </div>
            </div>
          </div>
        )}

        {spans.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('otelTrace.spans')}
            </div>
            <div className="space-y-2">
              {spans.map((span) => (
                <div key={span.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm text-gray-800 dark:text-gray-200" style={{ paddingLeft: `${(span.depth || 0) * 12}px` }}>
                      {span.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {span.durationMs.toFixed(1)}ms {span.kind ? `· ${span.kind}` : ''}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {span.service ? `${span.service} · ` : ''}{span.id}
                  </div>
                </div>
              ))}
            </div>
            <TextAreaWithCopy value={reportText} readOnly rows={5} />
          </div>
        )}
      </div>
    </ToolCard>
  )
}
