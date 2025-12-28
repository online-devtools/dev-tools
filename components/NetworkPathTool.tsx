'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type ResolverConfig = {
  id: string
  name: string
  url: string
  type: 'google' | 'rfc8484'
}

type DnsResult = {
  resolver: ResolverConfig
  durationMs: number
  status?: number
  answers: { name: string; data: string; ttl?: number }[]
  error?: string
}

type TraceHop = {
  hop: number
  host?: string
  ip?: string
  loss?: string
  avgMs?: number
}

const RESOLVERS: ResolverConfig[] = [
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    url: 'https://cloudflare-dns.com/dns-query',
    type: 'rfc8484',
  },
  {
    id: 'google',
    name: 'Google',
    url: 'https://dns.google/resolve',
    type: 'google',
  },
  {
    id: 'quad9',
    name: 'Quad9',
    url: 'https://dns.quad9.net/dns-query',
    type: 'rfc8484',
  },
]

const TRACE_SAMPLE = `traceroute to example.com (93.184.216.34), 64 hops max
 1  192.168.0.1 (192.168.0.1)  1.123 ms  0.945 ms  0.998 ms
 2  10.0.0.1 (10.0.0.1)  7.412 ms  7.211 ms  7.306 ms
 3  203.0.113.1 (203.0.113.1)  15.212 ms  14.998 ms  15.110 ms
`

const extractLatencies = (line: string) => {
  const matches = [...line.matchAll(/(\d+(?:\.\d+)?)\s*ms/g)]
  if (!matches.length) return []
  return matches.map((match) => Number(match[1])).filter((value) => !Number.isNaN(value))
}

const parseTraceOutput = (input: string): TraceHop[] => {
  const hops: TraceHop[] = []
  const lines = input.split('\n')
  for (const line of lines) {
    if (line.includes('|--') && line.includes('%')) {
      const parts = line.trim().split(/\s+/)
      const hopPart = parts[0]
      const hop = parseInt(hopPart.split('.')[0], 10)
      if (Number.isNaN(hop)) continue
      const host = parts[1]
      const loss = parts[2]
      const avg = parts[5] ? Number(parts[5]) : undefined
      hops.push({ hop, host, loss, avgMs: Number.isNaN(avg) ? undefined : avg })
      continue
    }

    const hopMatch = line.match(/^\s*(\d+)\s+/)
    if (hopMatch) {
      const hop = Number(hopMatch[1])
      const ipMatch = line.match(/(\d{1,3}(?:\.\d{1,3}){3})/)
      const latencies = extractLatencies(line)
      const avgMs = latencies.length ? latencies.reduce((sum, value) => sum + value, 0) / latencies.length : undefined
      hops.push({
        hop,
        ip: ipMatch ? ipMatch[1] : undefined,
        avgMs,
      })
    }
  }

  return hops
}

export default function NetworkPathTool() {
  const { t } = useLanguage()
  const [hostname, setHostname] = useState('')
  const [recordType, setRecordType] = useState('A')
  const [selectedResolvers, setSelectedResolvers] = useState<string[]>(RESOLVERS.map((resolver) => resolver.id))
  const [dnsResults, setDnsResults] = useState<DnsResult[]>([])
  const [dnsError, setDnsError] = useState('')
  const [isResolving, setIsResolving] = useState(false)
  const [traceInput, setTraceInput] = useState('')
  const [traceHops, setTraceHops] = useState<TraceHop[]>([])

  const runDnsLookup = async () => {
    if (!hostname.trim()) {
      setDnsError(t('networkPath.error.hostname'))
      return
    }

    const targets = RESOLVERS.filter((resolver) => selectedResolvers.includes(resolver.id))
    if (targets.length === 0) {
      setDnsError(t('networkPath.error.resolvers'))
      return
    }

    setIsResolving(true)
    setDnsError('')

    const results: DnsResult[] = []
    for (const resolver of targets) {
      const start = performance.now()
      try {
        const url =
          resolver.type === 'google'
            ? `${resolver.url}?name=${encodeURIComponent(hostname)}&type=${encodeURIComponent(recordType)}`
            : `${resolver.url}?name=${encodeURIComponent(hostname)}&type=${encodeURIComponent(recordType)}`

        const response = await fetch(url, {
          headers: { accept: 'application/dns-json' },
        })
        const json = await response.json()
        const answers = Array.isArray(json.Answer)
          ? json.Answer.map((answer: any) => ({
              name: answer.name,
              data: answer.data,
              ttl: answer.TTL,
            }))
          : []
        results.push({
          resolver,
          durationMs: performance.now() - start,
          status: json.Status,
          answers,
        })
      } catch (err) {
        results.push({
          resolver,
          durationMs: performance.now() - start,
          answers: [],
          error: err instanceof Error ? err.message : t('networkPath.error.lookup'),
        })
      }
    }

    setDnsResults(results)
    setIsResolving(false)
  }

  const traceSummary = useMemo(() => {
    if (!traceHops.length) return ''
    return traceHops
      .map((hop) => {
        const label = hop.host || hop.ip || '-'
        const latency = hop.avgMs ? `${hop.avgMs.toFixed(2)}ms` : '-'
        const loss = hop.loss ? `loss ${hop.loss}` : ''
        return `${hop.hop}. ${label} ${latency} ${loss}`.trim()
      })
      .join('\n')
  }, [traceHops])

  return (
    <ToolCard
      title={`🛰️ ${t('networkPath.title')}`}
      description={t('networkPath.description')}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('networkPath.dns.title')}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('networkPath.dns.hostname')}
              </label>
              <input
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                placeholder="example.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('networkPath.dns.recordType')}
              </label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {['A', 'AAAA', 'CNAME', 'TXT', 'MX', 'NS'].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('networkPath.dns.resolvers')}
            </label>
            <div className="flex flex-wrap gap-3">
              {RESOLVERS.map((resolver) => (
                <label key={resolver.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedResolvers.includes(resolver.id)}
                    onChange={(e) => {
                      setSelectedResolvers((prev) =>
                        e.target.checked ? [...prev, resolver.id] : prev.filter((id) => id !== resolver.id)
                      )
                    }}
                  />
                  {resolver.name}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={runDnsLookup}
              disabled={isResolving}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg"
            >
              {isResolving ? t('networkPath.dns.running') : t('networkPath.dns.run')}
            </button>
            <button
              onClick={() => {
                setDnsResults([])
                setDnsError('')
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
            >
              {t('networkPath.dns.clear')}
            </button>
          </div>

          {dnsError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
              {dnsError}
            </div>
          )}

          {dnsResults.length > 0 && (
            <div className="space-y-3">
              {dnsResults.map((result) => (
                <div key={result.resolver.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                      {result.resolver.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(result.durationMs)}ms
                    </div>
                  </div>
                  {result.error ? (
                    <div className="text-sm text-red-600 dark:text-red-300">{result.error}</div>
                  ) : (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {result.status === 0
                        ? t('networkPath.dns.ok')
                        : t('networkPath.dns.status', { status: result.status ?? 'unknown' })}
                    </div>
                  )}
                  {result.answers.length > 0 ? (
                    <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                      {result.answers.map((answer) => (
                        <div key={`${answer.name}-${answer.data}`}>
                          {answer.name} → {answer.data} {answer.ttl ? `(TTL ${answer.ttl})` : ''}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                      {t('networkPath.dns.noAnswer')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('networkPath.trace.title')}
          </div>
          <textarea
            value={traceInput}
            onChange={(e) => setTraceInput(e.target.value)}
            rows={6}
            placeholder={t('networkPath.trace.placeholder')}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTraceHops(parseTraceOutput(traceInput))}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              {t('networkPath.trace.parse')}
            </button>
            <button
              onClick={() => setTraceInput(TRACE_SAMPLE)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
            >
              {t('networkPath.trace.sample')}
            </button>
            <button
              onClick={() => {
                setTraceInput('')
                setTraceHops([])
              }}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
            >
              {t('networkPath.trace.clear')}
            </button>
          </div>

          {traceHops.length > 0 && (
            <div className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                {traceHops.map((hop) => (
                  <div key={`${hop.hop}-${hop.ip || hop.host}`} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('networkPath.trace.hop', { hop: hop.hop })}</div>
                    <div className="text-sm text-gray-800 dark:text-gray-200">{hop.host || hop.ip || '-'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {hop.avgMs ? `${hop.avgMs.toFixed(2)}ms` : t('networkPath.trace.noLatency')}
                      {hop.loss ? ` · ${t('networkPath.trace.loss', { loss: hop.loss })}` : ''}
                    </div>
                  </div>
                ))}
              </div>
              <TextAreaWithCopy value={traceSummary} readOnly rows={6} />
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  )
}
