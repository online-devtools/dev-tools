'use client'

import { useMemo, useState } from 'react'
import yaml from 'js-yaml'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type WorkflowIssue = {
  level: 'warn' | 'info'
  message: string
}

const isPinnedAction = (usesValue: string) => {
  if (!usesValue.includes('@')) return false
  const ref = usesValue.split('@')[1]
  return !['main', 'master', 'HEAD'].includes(ref)
}

export default function GhaWorkflowTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [issues, setIssues] = useState<WorkflowIssue[]>([])
  const [error, setError] = useState('')

  const analyze = () => {
    if (!input.trim()) {
      setError(t('gha.error.empty'))
      setIssues([])
      return
    }

    try {
      const doc = yaml.load(input) as any
      if (!doc || typeof doc !== 'object') {
        setError(t('gha.error.format'))
        setIssues([])
        return
      }

      const nextIssues: WorkflowIssue[] = []

      if (!doc.on) {
        nextIssues.push({ level: 'warn', message: t('gha.issue.missingOn') })
      }

      if (!doc.jobs) {
        nextIssues.push({ level: 'warn', message: t('gha.issue.missingJobs') })
      }

      if (!doc.permissions) {
        nextIssues.push({ level: 'info', message: t('gha.issue.missingPermissions') })
      } else if (doc.permissions === 'write-all') {
        nextIssues.push({ level: 'warn', message: t('gha.issue.writeAll') })
      }

      const jobs = doc.jobs || {}
      Object.values(jobs).forEach((job: any) => {
        const steps = Array.isArray(job.steps) ? job.steps : []
        steps.forEach((step: any) => {
          if (step.uses && typeof step.uses === 'string') {
            if (!isPinnedAction(step.uses)) {
              nextIssues.push({ level: 'warn', message: t('gha.issue.unpinned', { action: step.uses }) })
            }
          }
          if (step.run && typeof step.run === 'string' && step.run.includes('curl') && step.run.includes('|')) {
            nextIssues.push({ level: 'info', message: t('gha.issue.pipe', { step: step.name || 'run' }) })
          }
        })
      })

      setIssues(nextIssues)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('gha.error.format'))
      setIssues([])
    }
  }

  const summary = useMemo(() => {
    if (issues.length === 0) return ''
    return issues.map((issue) => `${issue.level.toUpperCase()}: ${issue.message}`).join('\n')
  }, [issues])

  return (
    <ToolCard title={`🤖 ${t('gha.title')}`} description={t('gha.description')}>
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('gha.input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder={t('gha.placeholder')}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={analyze} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            {t('gha.analyze')}
          </button>
          <button
            onClick={() => {
              setInput('')
              setIssues([])
              setError('')
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            {t('gha.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
            {error}
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

        {issues.length > 0 && <TextAreaWithCopy value={summary} readOnly rows={5} />}
      </div>
    </ToolCard>
  )
}
