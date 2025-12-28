'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type LighthouseReport = {
  finalUrl?: string
  fetchTime?: string
  categories?: Record<string, { title: string; score: number | null }>
  audits?: Record<string, any>
}

const safeJsonParse = (value: string): { ok: boolean; data?: any; error?: string } => {
  try {
    return { ok: true, data: JSON.parse(value) }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Invalid JSON' }
  }
}

const parseLighthouseReport = (data: any): LighthouseReport | null => {
  const report = data?.lighthouseResult || data?.lhr || data
  if (!report?.audits) return null
  return {
    finalUrl: report.finalUrl,
    fetchTime: report.fetchTime,
    categories: report.categories,
    audits: report.audits,
  }
}

export default function LighthouseReportTool() {
  const { t } = useLanguage()
  const [reportText, setReportText] = useState('')
  const [report, setReport] = useState<LighthouseReport | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = () => {
    const parsed = safeJsonParse(reportText)
    if (!parsed.ok) {
      setError(t('lighthouse.error.json'))
      setReport(null)
      return
    }

    const nextReport = parseLighthouseReport(parsed.data)
    if (!nextReport) {
      setError(t('lighthouse.error.format'))
      setReport(null)
      return
    }

    setReport(nextReport)
    setError('')
  }

  const handleFileUpload = async (file: File) => {
    const text = await file.text()
    setReportText(text)
  }

  const metrics = useMemo(() => {
    if (!report?.audits) return []
    const ids = [
      'first-contentful-paint',
      'largest-contentful-paint',
      'total-blocking-time',
      'speed-index',
      'cumulative-layout-shift',
      'interaction-to-next-paint',
    ]

    return ids
      .map((id) => {
        const audit = report.audits?.[id]
        if (!audit) return null
        return {
          id,
          title: audit.title,
          displayValue: audit.displayValue,
          numericValue: audit.numericValue,
        }
      })
      .filter(Boolean)
  }, [report])

  const opportunities = useMemo(() => {
    if (!report?.audits) return []
    return Object.values(report.audits)
      .filter((audit: any) => audit?.details?.type === 'opportunity' && audit.score !== null && audit.score < 1)
      .sort((a: any, b: any) => (b?.details?.overallSavingsMs || 0) - (a?.details?.overallSavingsMs || 0))
      .slice(0, 6)
  }, [report])

  const vitals = useMemo(() => {
    if (!report?.audits) return []
    const lcp = report.audits['largest-contentful-paint']?.numericValue
    const cls = report.audits['cumulative-layout-shift']?.numericValue
    const inp = report.audits['interaction-to-next-paint']?.numericValue

    return [
      {
        id: 'LCP',
        value: lcp,
        good: typeof lcp === 'number' ? lcp <= 2500 : null,
        label: report.audits['largest-contentful-paint']?.displayValue,
      },
      {
        id: 'CLS',
        value: cls,
        good: typeof cls === 'number' ? cls <= 0.1 : null,
        label: report.audits['cumulative-layout-shift']?.displayValue,
      },
      {
        id: 'INP',
        value: inp,
        good: typeof inp === 'number' ? inp <= 200 : null,
        label: report.audits['interaction-to-next-paint']?.displayValue,
      },
    ]
  }, [report])

  const reportSummary = useMemo(() => {
    if (!report) return ''
    const lines = [
      `URL: ${report.finalUrl || '-'}`,
      `Fetch Time: ${report.fetchTime || '-'}`,
    ]

    if (report.categories) {
      Object.values(report.categories).forEach((category) => {
        if (!category) return
        lines.push(`${category.title}: ${Math.round((category.score || 0) * 100)}`)
      })
    }

    metrics.forEach((metric: any) => {
      lines.push(`${metric.title}: ${metric.displayValue}`)
    })

    return lines.join('\n')
  }, [report, metrics])

  return (
    <ToolCard
      title={`🚦 ${t('lighthouse.title')}`}
      description={t('lighthouse.description')}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('lighthouse.input')}
          </label>
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            rows={8}
            placeholder={t('lighthouse.placeholder')}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <label className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg cursor-pointer">
            {t('lighthouse.upload')}
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleFileUpload(file)
                }
              }}
            />
          </label>
          <button
            onClick={handleAnalyze}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            {t('lighthouse.analyze')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {report && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {report.categories &&
                Object.values(report.categories).map((category) => (
                  <div key={category.title} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{category.title}</div>
                    <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      {Math.round((category.score || 0) * 100)}
                    </div>
                  </div>
                ))}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {vitals.map((vital) => (
                <div key={vital.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{vital.id}</div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{vital.label || '-'}</div>
                  <div className={`text-xs ${vital.good === null ? 'text-gray-400' : vital.good ? 'text-green-600' : 'text-red-600'}`}>
                    {vital.good === null ? t('lighthouse.vitals.unknown') : vital.good ? t('lighthouse.vitals.good') : t('lighthouse.vitals.bad')}
                  </div>
                </div>
              ))}
            </div>

            {metrics.length > 0 && (
              <div className="grid gap-3 md:grid-cols-2">
                {metrics.map((metric: any) => (
                  <div key={metric.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300">{metric.title}</div>
                    <div className="text-base font-semibold text-gray-800 dark:text-gray-200">{metric.displayValue}</div>
                  </div>
                ))}
              </div>
            )}

            {opportunities.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('lighthouse.opportunities')}
                </div>
                <div className="space-y-2">
                  {opportunities.map((item: any) => (
                    <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="text-sm text-gray-800 dark:text-gray-200">{item.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item?.details?.overallSavingsMs
                          ? `${Math.round(item.details.overallSavingsMs)}ms`
                          : t('lighthouse.opportunity.noSavings')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <TextAreaWithCopy
              label={t('lighthouse.summary')}
              value={reportSummary}
              readOnly
              rows={6}
            />
          </div>
        )}
      </div>
    </ToolCard>
  )
}
