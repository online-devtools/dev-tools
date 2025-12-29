'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type StageSummary = {
  name: string
  baseImage: string
  runCount: number
  copyCount: number
  addCount: number
  estimatedSize: string
}

type LintIssue = {
  level: 'warn' | 'info'
  message: string
}

const BASE_SIZE_HINTS: Record<string, string> = {
  alpine: '5-15MB',
  busybox: '1-5MB',
  ubuntu: '60-90MB',
  debian: '70-100MB',
  node: '120-200MB',
  python: '120-200MB',
  golang: '250-400MB',
}

const estimateBaseSize = (image: string) => {
  const lower = image.toLowerCase()
  const key = Object.keys(BASE_SIZE_HINTS).find((hint) => lower.includes(hint))
  return key ? BASE_SIZE_HINTS[key] : 'Unknown'
}

export default function DockerfileLinterTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [stages, setStages] = useState<StageSummary[]>([])
  const [issues, setIssues] = useState<LintIssue[]>([])
  const [error, setError] = useState('')

  const analyze = () => {
    if (!input.trim()) {
      setError(t('dockerfile.error.empty'))
      setStages([])
      setIssues([])
      return
    }

    const lines = input.split('\n')
    const nextStages: StageSummary[] = []
    const nextIssues: LintIssue[] = []

    let currentStage: StageSummary | null = null
    let hasUser = false

    lines.forEach((rawLine) => {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) return

      const fromMatch = line.match(/^FROM\s+([^\s]+)(?:\s+AS\s+(.+))?/i)
      if (fromMatch) {
        if (currentStage) {
          nextStages.push(currentStage)
        }
        const baseImage = fromMatch[1]
        const stageName = fromMatch[2] || baseImage
        currentStage = {
          name: stageName,
          baseImage,
          runCount: 0,
          copyCount: 0,
          addCount: 0,
          estimatedSize: estimateBaseSize(baseImage),
        }
        if (baseImage.includes(':latest')) {
          nextIssues.push({ level: 'warn', message: t('dockerfile.issue.latest', { image: baseImage }) })
        }
        return
      }

      if (!currentStage) return

      if (/^RUN\s+/i.test(line)) {
        currentStage.runCount += 1
        if (/apt-get/.test(line) && !/rm -rf \/var\/lib\/apt\/lists/.test(line)) {
          nextIssues.push({ level: 'info', message: t('dockerfile.issue.aptCleanup') })
        }
      }
      if (/^COPY\s+/i.test(line)) {
        currentStage.copyCount += 1
      }
      if (/^ADD\s+/i.test(line)) {
        currentStage.addCount += 1
        nextIssues.push({ level: 'info', message: t('dockerfile.issue.add') })
      }
      if (/^USER\s+/i.test(line)) {
        hasUser = true
      }
    })

    if (currentStage) {
      nextStages.push(currentStage)
    }

    if (!hasUser) {
      nextIssues.push({ level: 'warn', message: t('dockerfile.issue.user') })
    }

    setStages(nextStages)
    setIssues(nextIssues)
    setError('')
  }

  const summaryText = useMemo(() => {
    if (!stages.length) return ''
    return stages
      .map((stage) => `${stage.name}: ${stage.baseImage} (RUN ${stage.runCount}, COPY ${stage.copyCount}, ADD ${stage.addCount})`)
      .join('\n')
  }, [stages])

  return (
    <ToolCard title={`🐳 ${t('dockerfile.title')}`} description={t('dockerfile.description')}>
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('dockerfile.input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder={t('dockerfile.placeholder')}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={analyze} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            {t('dockerfile.analyze')}
          </button>
          <button
            onClick={() => {
              setInput('')
              setStages([])
              setIssues([])
              setError('')
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            {t('dockerfile.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {stages.length > 0 && (
          <div className="space-y-2">
            {stages.map((stage) => (
              <div key={stage.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{stage.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stage.baseImage} · {t('dockerfile.estimate')}: {stage.estimatedSize}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  RUN {stage.runCount} · COPY {stage.copyCount} · ADD {stage.addCount}
                </div>
              </div>
            ))}
          </div>
        )}

        {issues.length > 0 && (
          <div className="space-y-2">
            {issues.map((issue, index) => (
              <div
                key={`${issue.level}-${index}`}
                className={`p-3 rounded-lg text-sm ${issue.level === 'warn' ? 'bg-yellow-50 text-yellow-700' : 'bg-blue-50 text-blue-700'}`}
              >
                {issue.message}
              </div>
            ))}
          </div>
        )}

        {stages.length > 0 && <TextAreaWithCopy value={summaryText} readOnly rows={4} />}
      </div>
    </ToolCard>
  )
}
