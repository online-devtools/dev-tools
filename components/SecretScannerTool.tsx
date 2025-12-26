'use client'

import { useEffect, useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  getSecretPatterns,
  runSecretScannerSelfTest,
  scanSecrets,
  type SecretMatch,
  type SecretScanResult,
} from '@/utils/secretScanner'

export default function SecretScannerTool() {
  const { t } = useLanguage()
  // 사용자가 입력한 원본 텍스트를 저장합니다.
  const [inputText, setInputText] = useState('')
  // 스캔 결과를 UI에 렌더링하기 위한 상태입니다.
  const [scanResult, setScanResult] = useState<SecretScanResult | null>(null)
  // 오류 메시지를 표시하기 위한 상태입니다.
  const [error, setError] = useState('')
  // 시크릿 마스킹 여부를 사용자가 토글할 수 있게 합니다.
  const [maskOutput, setMaskOutput] = useState(true)
  // 업로드된 파일 정보를 표시하기 위해 메타데이터를 저장합니다.
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null)

  useEffect(() => {
    // 개발 환경에서 스캐너가 정상 동작하는지 간단 테스트를 수행합니다.
    runSecretScannerSelfTest()
  }, [])

  const patterns = useMemo(() => {
    // 패턴 목록은 고정값이므로 useMemo로 한 번만 계산합니다.
    return getSecretPatterns()
  }, [])

  const patternMap = useMemo(() => {
    // 빠른 조회를 위해 패턴 ID 기준으로 맵을 구성합니다.
    return new Map(patterns.map((pattern) => [pattern.id, pattern]))
  }, [patterns])

  const handleScan = () => {
    // 기존 결과를 초기화하고 오류 상태를 비웁니다.
    setError('')
    setScanResult(null)

    if (!inputText.trim()) {
      setError(t('secretScanner.error.empty'))
      return
    }

    try {
      // 입력 텍스트 전체를 스캔해 시크릿 패턴을 수집합니다.
      const result = scanSecrets(inputText, patterns)
      setScanResult(result)
    } catch {
      setError(t('secretScanner.error.unknown'))
    }
  }

  const handleClear = () => {
    // 입력/결과를 모두 초기화해 새 분석을 준비합니다.
    setInputText('')
    setScanResult(null)
    setError('')
    setFileMeta(null)
  }

  const handleFileChange = (file: File | null) => {
    if (!file) {
      return
    }

    // 파일 정보를 UI에 표시해 사용자가 어떤 파일을 올렸는지 알 수 있게 합니다.
    setFileMeta({ name: file.name, size: file.size })

    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      setInputText(text)
    }
    reader.onerror = () => {
      setError(t('secretScanner.error.readFile'))
    }
    reader.readAsText(file)
  }

  const reportText = useMemo(() => {
    // 외부 공유를 위해 결과를 JSON으로 출력합니다.
    if (!scanResult) {
      return ''
    }

    const exportMatches = scanResult.matches.map((match) => ({
      patternId: match.patternId,
      severity: match.severity,
      line: match.line,
      column: match.column,
      value: maskOutput ? match.maskedValue : match.value,
    }))

    return JSON.stringify(
      {
        totalMatches: scanResult.totalMatches,
        totalUnique: scanResult.totalUnique,
        bySeverity: scanResult.bySeverity,
        matches: exportMatches,
      },
      null,
      2
    )
  }, [scanResult, maskOutput])

  const renderMatchRow = (match: SecretMatch) => {
    // 테이블 렌더링을 단순화하기 위해 매칭 행 렌더러를 분리합니다.
    const pattern = patternMap.get(match.patternId)
    const displayValue = maskOutput ? match.maskedValue : match.value

    return (
      <tr key={match.id} className="border-b border-gray-200 dark:border-gray-700">
        <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
          {pattern ? t(pattern.labelKey) : match.patternId}
        </td>
        <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">{match.severity}</td>
        <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
          {match.line}:{match.column}
        </td>
        <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300 font-mono">
          {displayValue}
        </td>
      </tr>
    )
  }

  return (
    <ToolCard title={`🕵️ ${t('secretScanner.title')}`} description={t('secretScanner.description')}>
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('secretScanner.input.label')}
            </label>
            <TextAreaWithCopy
              value={inputText}
              onChange={setInputText}
              placeholder={t('secretScanner.input.placeholder')}
              rows={8}
            />
          </div>
          <div className="space-y-2">
            <input
              type="file"
              accept=".txt,.log,.env,.js,.ts,.json"
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

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleScan}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('secretScanner.actions.scan')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('secretScanner.actions.clear')}
          </button>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={maskOutput}
              onChange={(event) => setMaskOutput(event.target.checked)}
            />
            {t('secretScanner.options.mask')}
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {scanResult && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('secretScanner.summary.total')}
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {scanResult.totalMatches}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('secretScanner.summary.unique')}
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {scanResult.totalUnique}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('secretScanner.summary.severity')}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  high: {scanResult.bySeverity.high} · medium: {scanResult.bySeverity.medium} · low:{' '}
                  {scanResult.bySeverity.low}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-800 dark:text-white">
                {t('secretScanner.patterns.title')}
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {patterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300"
                  >
                    <div className="font-semibold text-gray-800 dark:text-white">
                      {t(pattern.labelKey)}
                    </div>
                    <div>{t(pattern.descriptionKey)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-800 dark:text-white">
                {t('secretScanner.results.title')}
              </div>
              {scanResult.matches.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('secretScanner.results.empty')}
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="min-w-full text-left">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                          {t('secretScanner.results.pattern')}
                        </th>
                        <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                          {t('secretScanner.results.severity')}
                        </th>
                        <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                          {t('secretScanner.results.location')}
                        </th>
                        <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                          {t('secretScanner.results.value')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                      {scanResult.matches.slice(0, 100).map((match) => renderMatchRow(match))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('secretScanner.results.note')}
              </div>
            </div>

            <TextAreaWithCopy
              value={reportText}
              label={t('secretScanner.report.label')}
              placeholder={t('secretScanner.report.placeholder')}
              rows={6}
              readOnly
            />
          </div>
        )}
      </div>
    </ToolCard>
  )
}
