'use client'

import { useMemo, useState } from 'react'
import yaml from 'js-yaml'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type ManifestIssue = {
  level: 'warn' | 'info'
  message: string
}

type ManifestSummary = {
  docs: number
  warnings: number
}

const WORKLOAD_KINDS = new Set(['Deployment', 'StatefulSet', 'DaemonSet', 'Job', 'CronJob', 'Pod'])

const getPodSpec = (doc: any) => {
  if (!doc) return null
  if (doc.kind === 'Pod') return doc.spec
  if (doc.kind === 'CronJob') return doc.spec?.jobTemplate?.spec?.template?.spec
  return doc.spec?.template?.spec
}

export default function K8sManifestTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [issues, setIssues] = useState<ManifestIssue[]>([])
  const [summary, setSummary] = useState<ManifestSummary | null>(null)
  const [error, setError] = useState('')

  const analyze = () => {
    if (!input.trim()) {
      setError(t('k8sValidator.error.empty'))
      setIssues([])
      setSummary(null)
      return
    }

    try {
      const docs: any[] = []
      yaml.loadAll(input, (doc) => {
        if (doc) docs.push(doc)
      })

      if (docs.length === 0) {
        setError(t('k8sValidator.error.format'))
        setIssues([])
        setSummary(null)
        return
      }

      const nextIssues: ManifestIssue[] = []

      docs.forEach((doc) => {
        const kind = doc?.kind
        const name = doc?.metadata?.name
        if (!kind) {
          nextIssues.push({ level: 'warn', message: t('k8sValidator.issue.missingKind') })
          return
        }
        if (!name) {
          nextIssues.push({ level: 'warn', message: t('k8sValidator.issue.missingName', { kind }) })
        }

        if (WORKLOAD_KINDS.has(kind)) {
          const podSpec = getPodSpec(doc)
          if (!podSpec) {
            nextIssues.push({ level: 'warn', message: t('k8sValidator.issue.missingPodSpec', { kind }) })
            return
          }

          const containers = Array.isArray(podSpec.containers) ? podSpec.containers : []
          containers.forEach((container: any) => {
            const containerName = container?.name || 'container'
            if (!container?.resources?.limits) {
              nextIssues.push({ level: 'warn', message: t('k8sValidator.issue.missingLimits', { name: containerName }) })
            }
            if (!container?.resources?.requests) {
              nextIssues.push({ level: 'warn', message: t('k8sValidator.issue.missingRequests', { name: containerName }) })
            }
            if (!container?.livenessProbe) {
              nextIssues.push({ level: 'info', message: t('k8sValidator.issue.liveness', { name: containerName }) })
            }
            if (!container?.readinessProbe) {
              nextIssues.push({ level: 'info', message: t('k8sValidator.issue.readiness', { name: containerName }) })
            }
            if (typeof container?.image === 'string' && container.image.endsWith(':latest')) {
              nextIssues.push({ level: 'warn', message: t('k8sValidator.issue.latestTag', { name: containerName }) })
            }
          })

          const security = podSpec.securityContext || {}
          if (security.runAsNonRoot !== true) {
            nextIssues.push({ level: 'info', message: t('k8sValidator.issue.runAsNonRoot', { kind }) })
          }
        }
      })

      setIssues(nextIssues)
      setSummary({ docs: docs.length, warnings: nextIssues.filter((issue) => issue.level === 'warn').length })
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('k8sValidator.error.format'))
      setIssues([])
      setSummary(null)
    }
  }

  const reportText = useMemo(() => {
    if (!summary) return ''
    return [
      `Documents: ${summary.docs}`,
      `Warnings: ${summary.warnings}`,
      `Issues: ${issues.length}`,
    ].join('\n')
  }, [summary, issues])

  return (
    <ToolCard title={`☸️ ${t('k8sValidator.title')}`} description={t('k8sValidator.description')}>
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('k8sValidator.input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder={t('k8sValidator.placeholder')}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={analyze} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            {t('k8sValidator.analyze')}
          </button>
          <button
            onClick={() => {
              setInput('')
              setIssues([])
              setSummary(null)
              setError('')
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            {t('k8sValidator.clear')}
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
              <div className="text-xs text-gray-500 dark:text-gray-400">{t('k8sValidator.summary.docs')}</div>
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">{summary.docs}</div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">{t('k8sValidator.summary.warnings')}</div>
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">{summary.warnings}</div>
            </div>
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

        {summary && <TextAreaWithCopy value={reportText} readOnly rows={4} />}
      </div>
    </ToolCard>
  )
}
