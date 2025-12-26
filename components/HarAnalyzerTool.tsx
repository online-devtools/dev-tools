'use client'

import { useEffect, useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  analyzeHar,
  formatBytes,
  formatDuration,
  runHarAnalyzerSelfTest,
  type HarAnalysis,
  type HarEntrySummary,
} from '@/utils/harAnalyzer'

export default function HarAnalyzerTool() {
  const { t } = useLanguage()
  // HAR 원본 텍스트 입력값을 저장합니다.
  const [harText, setHarText] = useState('')
  // 분석 결과가 있으면 UI에 바로 렌더링하도록 상태로 관리합니다.
  const [analysis, setAnalysis] = useState<HarAnalysis | null>(null)
  // 사용자에게 오류 메시지를 보여주기 위한 상태입니다.
  const [error, setError] = useState('')
  // 업로드된 파일 메타데이터를 표시하기 위한 상태입니다.
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null)

  useEffect(() => {
    // 개발 환경에서 분석 유틸리티가 정상 동작하는지 빠르게 확인합니다.
    runHarAnalyzerSelfTest()
  }, [])

  const handleAnalyze = () => {
    // 기존 오류와 결과를 먼저 초기화해 새 분석 결과가 명확히 보이게 합니다.
    setError('')
    setAnalysis(null)

    if (!harText.trim()) {
      setError(t('harAnalyzer.error.empty'))
      return
    }

    try {
      // HAR 텍스트를 파싱하고 요약 통계를 생성합니다.
      const result = analyzeHar(harText)
      setAnalysis(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown'
      if (message === 'invalid_json') {
        setError(t('harAnalyzer.error.invalidJson'))
      } else if (message === 'invalid_har') {
        setError(t('harAnalyzer.error.invalidHar'))
      } else {
        setError(t('harAnalyzer.error.unknown'))
      }
    }
  }

  const handleClear = () => {
    // 모든 입력과 결과를 초기화해 다음 HAR 분석을 준비합니다.
    setHarText('')
    setAnalysis(null)
    setError('')
    setFileMeta(null)
  }

  const handleFileChange = (file: File | null) => {
    if (!file) {
      return
    }

    // 파일 메타데이터를 먼저 표시해 사용자에게 업로드 상태를 알려줍니다.
    setFileMeta({ name: file.name, size: file.size })

    const reader = new FileReader()
    // FileReader가 성공적으로 완료되면 텍스트 입력값에 반영합니다.
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      setHarText(text)
    }
    // 파일 읽기 중 오류가 발생하면 사용자에게 알려줍니다.
    reader.onerror = () => {
      setError(t('harAnalyzer.error.readFile'))
    }
    reader.readAsText(file)
  }

  const reportText = useMemo(() => {
    // 요약 결과를 JSON으로 제공해 다른 도구로 복사/공유할 수 있게 합니다.
    if (!analysis) {
      return ''
    }
    return JSON.stringify(analysis.summary, null, 2)
  }, [analysis])

  const renderEntryRow = (entry: HarEntrySummary) => {
    // 테이블 렌더링을 단순화하기 위해 행 렌더러를 분리했습니다.
    return (
      <tr key={entry.id} className="border-b border-gray-200 dark:border-gray-700">
        <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">{entry.method}</td>
        <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300 truncate max-w-[280px]">
          {entry.url}
        </td>
        <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">{entry.status}</td>
        <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">{formatDuration(entry.timeMs)}</td>
        <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">{formatBytes(entry.sizeBytes)}</td>
      </tr>
    )
  }

  return (
    <ToolCard title={`📡 ${t('harAnalyzer.title')}`} description={t('harAnalyzer.description')}>
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('harAnalyzer.input.label')}
            </label>
            <TextAreaWithCopy
              value={harText}
              onChange={setHarText}
              placeholder={t('harAnalyzer.input.placeholder')}
              rows={8}
            />
          </div>
          <div className="space-y-2">
            <input
              type="file"
              accept=".har,application/json"
              onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-700 dark:text-gray-300"
            />
            {fileMeta && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {fileMeta.name} · {formatBytes(fileMeta.size)}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAnalyze}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('harAnalyzer.actions.analyze')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('harAnalyzer.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('harAnalyzer.summary.totalRequests')}
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {analysis.summary.totalRequests}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('harAnalyzer.summary.totalTime')}
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formatDuration(analysis.summary.totalTimeMs)}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('harAnalyzer.summary.averageTime')}
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formatDuration(analysis.summary.averageTimeMs)}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('harAnalyzer.summary.totalSize')}
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formatBytes(analysis.summary.totalBytes)}
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                  {t('harAnalyzer.summary.statusBreakdown')}
                </div>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <div>2xx: {analysis.summary.statusGroups['2xx']}</div>
                  <div>3xx: {analysis.summary.statusGroups['3xx']}</div>
                  <div>4xx: {analysis.summary.statusGroups['4xx']}</div>
                  <div>5xx: {analysis.summary.statusGroups['5xx']}</div>
                  <div>Other: {analysis.summary.statusGroups.other}</div>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                  {t('harAnalyzer.summary.topSlow')}
                </div>
                <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                  {analysis.summary.topSlow.map((entry) => (
                    <li key={`slow-${entry.id}`}>
                      {entry.method} {entry.host} · {formatDuration(entry.timeMs)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                  {t('harAnalyzer.summary.topSize')}
                </div>
                <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                  {analysis.summary.topSize.map((entry) => (
                    <li key={`size-${entry.id}`}>
                      {entry.method} {entry.host} · {formatBytes(entry.sizeBytes)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-800 dark:text-white">
                {t('harAnalyzer.table.title')}
              </div>
              <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                        {t('harAnalyzer.table.method')}
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                        {t('harAnalyzer.table.url')}
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                        {t('harAnalyzer.table.status')}
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                        {t('harAnalyzer.table.time')}
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                        {t('harAnalyzer.table.size')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800">
                    {analysis.entries.slice(0, 50).map((entry) => renderEntryRow(entry))}
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('harAnalyzer.table.note')}
              </div>
            </div>

            <TextAreaWithCopy
              value={reportText}
              label={t('harAnalyzer.report.label')}
              placeholder={t('harAnalyzer.report.placeholder')}
              rows={6}
              readOnly
            />
          </div>
        )}
      </div>
    </ToolCard>
  )
}
