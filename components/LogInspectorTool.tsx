'use client'

import { useEffect, useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  LOG_LEVELS,
  analyzeLogs,
  filterLogEntries,
  runLogInspectorSelfTest,
  toLogText,
  type LogAnalysis,
  type LogFilterOptions,
  type LogLevel,
} from '@/utils/logInspector'

const buildLevelState = (): Record<LogLevel, boolean> => {
  return LOG_LEVELS.reduce((acc, level) => {
    acc[level] = true
    return acc
  }, {} as Record<LogLevel, boolean>)
}

export default function LogInspectorTool() {
  const { t } = useLanguage()
  // 로그 원문 입력값을 저장합니다.
  const [logText, setLogText] = useState('')
  // 분석 결과를 상태에 저장해 필터링과 요약에 사용합니다.
  const [analysis, setAnalysis] = useState<LogAnalysis | null>(null)
  // 오류 메시지를 사용자에게 보여주기 위한 상태입니다.
  const [error, setError] = useState('')
  // 업로드된 파일 정보를 표시하기 위한 메타데이터입니다.
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null)

  // 필터 조건 상태를 분리해 UI 컨트롤과 연결합니다.
  const [searchTerm, setSearchTerm] = useState('')
  const [excludeTerm, setExcludeTerm] = useState('')
  const [levelState, setLevelState] = useState<Record<LogLevel, boolean>>(buildLevelState)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  useEffect(() => {
    // 개발 환경에서 로그 파서가 정상 작동하는지 확인합니다.
    runLogInspectorSelfTest()
  }, [])

  const handleAnalyze = () => {
    setError('')
    setAnalysis(null)

    if (!logText.trim()) {
      setError(t('logInspector.error.empty'))
      return
    }

    // 로그 텍스트를 파싱해 요약 정보를 생성합니다.
    const result = analyzeLogs(logText)
    setAnalysis(result)
  }

  const handleClear = () => {
    // 입력/결과/필터를 초기화해 새 분석을 준비합니다.
    setLogText('')
    setAnalysis(null)
    setError('')
    setFileMeta(null)
    setSearchTerm('')
    setExcludeTerm('')
    setLevelState(buildLevelState())
    setStartTime('')
    setEndTime('')
  }

  const handleFileChange = (file: File | null) => {
    if (!file) {
      return
    }

    setFileMeta({ name: file.name, size: file.size })

    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      setLogText(text)
    }
    reader.onerror = () => {
      setError(t('logInspector.error.readFile'))
    }
    reader.readAsText(file)
  }

  const selectedLevels = useMemo(() => {
    return LOG_LEVELS.filter((level) => levelState[level])
  }, [levelState])

  const filterOptions = useMemo<LogFilterOptions>(() => {
    return {
      searchTerm,
      excludeTerm,
      levels: selectedLevels,
      startTime,
      endTime,
    }
  }, [searchTerm, excludeTerm, selectedLevels, startTime, endTime])

  const filteredEntries = useMemo(() => {
    if (!analysis) {
      return []
    }
    return filterLogEntries(analysis.entries, filterOptions)
  }, [analysis, filterOptions])

  const filteredText = useMemo(() => {
    return toLogText(filteredEntries)
  }, [filteredEntries])

  const reportText = useMemo(() => {
    if (!analysis) {
      return ''
    }

    return JSON.stringify(
      {
        summary: analysis.summary,
        filter: filterOptions,
        filteredCount: filteredEntries.length,
        sample: filteredEntries.slice(0, 50),
      },
      null,
      2
    )
  }, [analysis, filterOptions, filteredEntries])

  const toggleLevel = (level: LogLevel) => {
    setLevelState((prev) => ({
      ...prev,
      [level]: !prev[level],
    }))
  }

  return (
    <ToolCard title={`🪵 ${t('logInspector.title')}`} description={t('logInspector.description')}>
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('logInspector.input.label')}
            </label>
            <TextAreaWithCopy
              value={logText}
              onChange={setLogText}
              placeholder={t('logInspector.input.placeholder')}
              rows={8}
            />
          </div>
          <div className="space-y-2">
            <input
              type="file"
              accept=".log,.txt"
              onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-700 dark:text-gray-300"
            />
            {fileMeta && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {fileMeta.name} · {Math.round(fileMeta.size / 1024)} KB
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAnalyze}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('logInspector.actions.analyze')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('logInspector.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('logInspector.summary.total')}</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {analysis.summary.totalLines}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('logInspector.summary.parsed')}</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {analysis.summary.parsedLines}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('logInspector.summary.filtered')}</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {filteredEntries.length}
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                  {t('logInspector.summary.levels')}
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-700 dark:text-gray-200">
                  {LOG_LEVELS.map((level) => (
                    <span
                      key={level}
                      className="rounded-full bg-white/70 dark:bg-gray-700 px-3 py-1 border border-gray-200 dark:border-gray-600"
                    >
                      {level}: {analysis.summary.byLevel[level]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                  {t('logInspector.summary.timeRange')}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  <div>
                    {t('logInspector.summary.timeStart')}: {analysis.summary.timeRange.start ?? '-'}
                  </div>
                  <div>
                    {t('logInspector.summary.timeEnd')}: {analysis.summary.timeRange.end ?? '-'}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-800 dark:text-white">
                {t('logInspector.filters.title')}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {t('logInspector.filters.search')}
                  </label>
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
                    placeholder={t('logInspector.filters.searchPlaceholder')}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {t('logInspector.filters.exclude')}
                  </label>
                  <input
                    value={excludeTerm}
                    onChange={(event) => setExcludeTerm(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
                    placeholder={t('logInspector.filters.excludePlaceholder')}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {t('logInspector.filters.startTime')}
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {t('logInspector.filters.endTime')}
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {LOG_LEVELS.map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"
                  >
                    <input
                      type="checkbox"
                      checked={levelState[level]}
                      onChange={() => toggleLevel(level)}
                    />
                    {level}
                  </label>
                ))}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('logInspector.filters.note')}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-800 dark:text-white">
                {t('logInspector.table.title')}
              </div>
              {filteredEntries.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('logInspector.table.empty')}
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="min-w-full text-left">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                          {t('logInspector.table.line')}
                        </th>
                        <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                          {t('logInspector.table.time')}
                        </th>
                        <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                          {t('logInspector.table.level')}
                        </th>
                        <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                          {t('logInspector.table.message')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                      {filteredEntries.slice(0, 100).map((entry) => (
                        <tr key={entry.id} className="border-b border-gray-200 dark:border-gray-700">
                          <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
                            {entry.lineNumber}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
                            {entry.timestamp ?? '-'}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
                            {entry.level}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300 truncate max-w-[320px]">
                            {entry.raw}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('logInspector.table.note')}
              </div>
            </div>

            <TextAreaWithCopy
              value={filteredText}
              label={t('logInspector.output.filtered.label')}
              placeholder={t('logInspector.output.filtered.placeholder')}
              rows={6}
              readOnly
            />

            <TextAreaWithCopy
              value={reportText}
              label={t('logInspector.report.label')}
              placeholder={t('logInspector.report.placeholder')}
              rows={6}
              readOnly
            />
          </div>
        )}
      </div>
    </ToolCard>
  )
}
