'use client'

import { useEffect, useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  EnvLinterError,
  lintEnv,
  maskEnvValue,
  parseRequiredKeys,
  runEnvLinterSelfTest,
  type EnvLintIssue,
  type EnvLintResult,
  type EnvLintSeverity,
} from '@/utils/envLinter'

type SeverityStyle = {
  labelClassName: string
  badgeClassName: string
}

const severityStyles: Record<EnvLintSeverity, SeverityStyle> = {
  error: {
    labelClassName: 'text-red-600 dark:text-red-300',
    badgeClassName: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200',
  },
  warning: {
    labelClassName: 'text-amber-600 dark:text-amber-300',
    badgeClassName: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
  },
  info: {
    labelClassName: 'text-blue-600 dark:text-blue-300',
    badgeClassName: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200',
  },
}

export default function EnvLinterTool() {
  const { t } = useLanguage()
  // .env 원문을 저장해 린트 결과를 계산할 때 사용합니다.
  const [envText, setEnvText] = useState('')
  // 필수 키 목록은 별도 입력으로 받아 누락 여부를 확인합니다.
  const [requiredText, setRequiredText] = useState('')
  // 린트 결과를 상태로 저장해 UI에 렌더링합니다.
  const [lintResult, setLintResult] = useState<EnvLintResult | null>(null)
  // 오류 메시지를 표시하기 위한 상태입니다.
  const [error, setError] = useState('')
  // 민감 정보 마스킹 여부를 사용자가 토글할 수 있게 합니다.
  const [maskValues, setMaskValues] = useState(true)
  // 업로드된 파일 정보를 표시하기 위한 메타데이터입니다.
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null)

  useEffect(() => {
    // 개발 환경에서 린터 로직이 정상인지 간단 검증합니다.
    runEnvLinterSelfTest()
  }, [])

  const handleAnalyze = () => {
    setError('')
    setLintResult(null)

    try {
      // 필수 키 목록을 파싱한 뒤 린트를 수행합니다.
      const requiredKeys = parseRequiredKeys(requiredText)
      const result = lintEnv(envText, requiredKeys)
      setLintResult(result)
    } catch (err) {
      if (err instanceof EnvLinterError && err.code === 'empty') {
        setError(t('envLinter.error.empty'))
      } else {
        setError(t('envLinter.error.unknown'))
      }
    }
  }

  const handleClear = () => {
    // 모든 입력과 결과를 초기화해 새 분석을 준비합니다.
    setEnvText('')
    setRequiredText('')
    setLintResult(null)
    setError('')
    setFileMeta(null)
  }

  const handleFileChange = (file: File | null) => {
    if (!file) {
      return
    }

    setFileMeta({ name: file.name, size: file.size })

    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      setEnvText(text)
    }
    reader.onerror = () => {
      setError(t('envLinter.error.readFile'))
    }
    reader.readAsText(file)
  }

  const normalizedOutput = useMemo(() => {
    if (!lintResult) {
      return ''
    }

    if (!maskValues) {
      return lintResult.normalizedEnv
    }

    return lintResult.normalizedEnv
      .split('\n')
      .map((line) => {
        const separatorIndex = line.indexOf('=')
        if (separatorIndex <= 0) {
          return line
        }
        const key = line.slice(0, separatorIndex)
        const value = line.slice(separatorIndex + 1)
        return `${key}=${maskEnvValue(value)}`
      })
      .join('\n')
  }, [lintResult, maskValues])

  const reportText = useMemo(() => {
    if (!lintResult) {
      return ''
    }

    const exportEntries = lintResult.entries.map((entry) => ({
      key: entry.key,
      line: entry.line,
      value: maskValues ? maskEnvValue(entry.value) : entry.value,
    }))

    return JSON.stringify(
      {
        summary: lintResult.summary,
        requiredMissingKeys: lintResult.requiredMissingKeys,
        issues: lintResult.issues,
        entries: exportEntries,
      },
      null,
      2
    )
  }, [lintResult, maskValues])

  const renderIssueRow = (issue: EnvLintIssue) => {
    const severityStyle = severityStyles[issue.severity]
    return (
      <tr key={issue.id} className="border-b border-gray-200 dark:border-gray-700">
        <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
          {t(`envLinter.issue.${issue.type}`)}
        </td>
        <td className="px-3 py-2 text-xs">
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${severityStyle.badgeClassName}`}>
            {issue.severity}
          </span>
        </td>
        <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
          {issue.line ?? '-'}
        </td>
        <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
          {issue.key ?? '-'}
        </td>
        <td className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 truncate max-w-[260px]">
          {issue.rawLine ?? '-'}
        </td>
      </tr>
    )
  }

  return (
    <ToolCard title={`🧪 ${t('envLinter.title')}`} description={t('envLinter.description')}>
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('envLinter.input.label')}
            </label>
            <TextAreaWithCopy
              value={envText}
              onChange={setEnvText}
              placeholder={t('envLinter.input.placeholder')}
              rows={8}
            />
          </div>
          <div className="space-y-2">
            <input
              type="file"
              accept=".env,.txt,.log"
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('envLinter.required.label')}
          </label>
          <TextAreaWithCopy
            value={requiredText}
            onChange={setRequiredText}
            placeholder={t('envLinter.required.placeholder')}
            rows={3}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleAnalyze}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('envLinter.actions.analyze')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('envLinter.actions.clear')}
          </button>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={maskValues}
              onChange={(event) => setMaskValues(event.target.checked)}
            />
            {t('envLinter.options.mask')}
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {lintResult && (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('envLinter.summary.totalLines')}</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {lintResult.summary.totalLines}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('envLinter.summary.parsed')}</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {lintResult.summary.parsedEntries}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('envLinter.summary.duplicate')}</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {lintResult.summary.duplicateKeys}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('envLinter.summary.missingValue')}</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {lintResult.summary.missingValues}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('envLinter.summary.requiredMissing')}</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {lintResult.summary.requiredMissing}
                </div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('envLinter.summary.invalidLines')}</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {lintResult.summary.invalidLines}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              {t('envLinter.summary.totalIssues', { count: lintResult.issues.length })}
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-800 dark:text-white">
                {t('envLinter.issues.title')}
              </div>
              {lintResult.issues.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('envLinter.issues.empty')}
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  <table className="min-w-full text-left">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                          {t('envLinter.issues.columns.type')}
                        </th>
                        <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                          {t('envLinter.issues.columns.severity')}
                        </th>
                        <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                          {t('envLinter.issues.columns.line')}
                        </th>
                        <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                          {t('envLinter.issues.columns.key')}
                        </th>
                        <th className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-200">
                          {t('envLinter.issues.columns.detail')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                      {lintResult.issues.map((issue) => renderIssueRow(issue))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('envLinter.issues.note')}
              </div>
            </div>

            <TextAreaWithCopy
              value={normalizedOutput}
              label={t('envLinter.output.normalized.label')}
              placeholder={t('envLinter.output.normalized.placeholder')}
              rows={6}
              readOnly
            />

            <TextAreaWithCopy
              value={reportText}
              label={t('envLinter.report.label')}
              placeholder={t('envLinter.report.placeholder')}
              rows={6}
              readOnly
            />
          </div>
        )}
      </div>
    </ToolCard>
  )
}
