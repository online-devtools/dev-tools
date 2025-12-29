'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type DiffSummary = {
  added: number
  removed: number
  risky: string[]
}

const diffLines = (beforeText: string, afterText: string) => {
  const beforeLines = beforeText.split('\n')
  const afterLines = afterText.split('\n')
  const beforeSet = new Set(beforeLines)
  const afterSet = new Set(afterLines)

  const added = afterLines.filter((line) => line && !beforeSet.has(line)).length
  const removed = beforeLines.filter((line) => line && !afterSet.has(line)).length

  return { added, removed }
}

const findRiskyChanges = (text: string) => {
  const risky: string[] = []
  const patterns = [
    { label: 'destroy', regex: /destroy/i },
    { label: 'replace', regex: /replace/i },
    { label: 'delete', regex: /delete/i },
    { label: 'force new resource', regex: /forces? new resource/i },
  ]

  patterns.forEach((pattern) => {
    if (pattern.regex.test(text)) {
      risky.push(pattern.label)
    }
  })

  return risky
}

export default function TerraformDiffTool() {
  const { t } = useLanguage()
  const [beforeText, setBeforeText] = useState('')
  const [afterText, setAfterText] = useState('')
  const [summary, setSummary] = useState<DiffSummary | null>(null)
  const [error, setError] = useState('')

  const analyze = () => {
    if (!beforeText.trim() || !afterText.trim()) {
      setError(t('terraformDiff.error.empty'))
      setSummary(null)
      return
    }

    const { added, removed } = diffLines(beforeText, afterText)
    const risky = findRiskyChanges(`${beforeText}\n${afterText}`)

    setSummary({ added, removed, risky })
    setError('')
  }

  const reportText = useMemo(() => {
    if (!summary) return ''
    return [
      `Added lines: ${summary.added}`,
      `Removed lines: ${summary.removed}`,
      `Risk keywords: ${summary.risky.length ? summary.risky.join(', ') : 'none'}`,
    ].join('\n')
  }, [summary])

  return (
    <ToolCard title={`🌍 ${t('terraformDiff.title')}`} description={t('terraformDiff.description')}>
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('terraformDiff.before')}</label>
            <textarea
              value={beforeText}
              onChange={(e) => setBeforeText(e.target.value)}
              rows={8}
              placeholder={t('terraformDiff.before.placeholder')}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('terraformDiff.after')}</label>
            <textarea
              value={afterText}
              onChange={(e) => setAfterText(e.target.value)}
              rows={8}
              placeholder={t('terraformDiff.after.placeholder')}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={analyze} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            {t('terraformDiff.analyze')}
          </button>
          <button
            onClick={() => {
              setBeforeText('')
              setAfterText('')
              setSummary(null)
              setError('')
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            {t('terraformDiff.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {summary && (
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('terraformDiff.summary.added')}</div>
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">{summary.added}</div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('terraformDiff.summary.removed')}</div>
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">{summary.removed}</div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('terraformDiff.summary.risk')}</div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {summary.risky.length ? summary.risky.join(', ') : t('terraformDiff.summary.none')}
                </div>
              </div>
            </div>
            <TextAreaWithCopy value={reportText} readOnly rows={4} />
          </div>
        )}
      </div>
    </ToolCard>
  )
}
