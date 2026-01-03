'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import ToolSchemas from './ToolSchemas'

const SAMPLE_SCENARIO = `[
  {
    "name": "Login",
    "method": "POST",
    "path": "/auth/login",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": {
      "email": "{{email}}",
      "password": "{{password}}"
    },
    "extract": {
      "token": "token"
    }
  },
  {
    "name": "Profile",
    "method": "GET",
    "path": "/me",
    "headers": {
      "Authorization": "Bearer {{token}}"
    }
  }
]`

const SAMPLE_VARS = `{
  "email": "user@example.com",
  "password": "secret"
}`

type ScenarioStep = {
  name?: string
  method?: string
  path: string
  headers?: Record<string, string>
  body?: unknown
  extract?: Record<string, string>
}

type ResponseResult = {
  ok: boolean
  status?: number
  durationMs: number
  bodyText: string
  bodyJson?: unknown
  error?: string
}

type StepResult = {
  name: string
  request: {
    method: string
    url: string
  }
  baseline: ResponseResult
  candidate: ResponseResult
  diff: {
    statusMismatch: boolean
    bodyMismatch: boolean
    differences: string[]
  }
}

const safeJsonParse = (value: string): { ok: boolean; data?: unknown; error?: string } => {
  try {
    return { ok: true, data: JSON.parse(value) }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Invalid JSON' }
  }
}

const joinUrl = (base: string, path: string) => {
  const trimmedBase = base.replace(/\/+$/, '')
  const trimmedPath = path.startsWith('/') ? path : `/${path}`
  return `${trimmedBase}${trimmedPath}`
}

const applyVariables = (value: unknown, vars: Record<string, string>): unknown => {
  if (typeof value === 'string') {
    return value.replace(/{{\s*([\w.-]+)\s*}}/g, (_, key: string) => {
      return Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : ''
    })
  }

  if (Array.isArray(value)) {
    return value.map((item) => applyVariables(item, vars))
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, applyVariables(item, vars)])
    )
  }

  return value
}

const getValueByPath = (data: unknown, path: string): unknown => {
  if (!path) return undefined
  const normalized = path.startsWith('$.') ? path.slice(2) : path
  return normalized.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, data)
}

const diffJson = (baseline: unknown, candidate: unknown, prefix = '', depth = 0): string[] => {
  if (depth > 6) return []
  if (baseline === candidate) return []

  if (typeof baseline !== typeof candidate) {
    return [`${prefix || '$'}: type ${typeof baseline} → ${typeof candidate}`]
  }

  if (Array.isArray(baseline) && Array.isArray(candidate)) {
    const max = Math.max(baseline.length, candidate.length)
    const diffs: string[] = []
    for (let i = 0; i < max; i += 1) {
      const next = diffJson(baseline[i], candidate[i], `${prefix}[${i}]`, depth + 1)
      diffs.push(...next)
      if (diffs.length > 20) return diffs
    }
    return diffs
  }

  if (baseline && candidate && typeof baseline === 'object' && typeof candidate === 'object') {
    const keys = new Set([...Object.keys(baseline as Record<string, unknown>), ...Object.keys(candidate as Record<string, unknown>)])
    const diffs: string[] = []
    keys.forEach((key) => {
      const next = diffJson(
        (baseline as Record<string, unknown>)[key],
        (candidate as Record<string, unknown>)[key],
        prefix ? `${prefix}.${key}` : key,
        depth + 1
      )
      diffs.push(...next)
    })
    return diffs
  }

  return [`${prefix || '$'}: ${String(baseline)} → ${String(candidate)}`]
}

export default function ApiScenarioTool() {
  const { t } = useLanguage()
  const [baselineUrl, setBaselineUrl] = useState('')
  const [candidateUrl, setCandidateUrl] = useState('')
  const [scenarioText, setScenarioText] = useState('')
  const [varsText, setVarsText] = useState('')
  const [results, setResults] = useState<StepResult[]>([])
  const [error, setError] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const runScenario = async () => {
    if (!baselineUrl.trim() || !candidateUrl.trim()) {
      setError(t('apiScenario.error.baseUrl'))
      return
    }

    const scenarioParse = safeJsonParse(scenarioText)
    if (!scenarioParse.ok || !Array.isArray(scenarioParse.data)) {
      setError(t('apiScenario.error.scenario'))
      return
    }

    const varsParse = varsText.trim() ? safeJsonParse(varsText) : { ok: true, data: {} }
    if (!varsParse.ok || !varsParse.data || typeof varsParse.data !== 'object' || Array.isArray(varsParse.data)) {
      setError(t('apiScenario.error.variables'))
      return
    }

    setError('')
    setIsRunning(true)
    setResults([])

    const baseVars = varsParse.data as Record<string, string>
    const baselineVars: Record<string, string> = { ...baseVars }
    const candidateVars: Record<string, string> = { ...baseVars }
    const scenario = scenarioParse.data as ScenarioStep[]
    const nextResults: StepResult[] = []

    for (const step of scenario) {
      const method = (step.method || 'GET').toUpperCase()
      const name = step.name || `${method} ${step.path}`

      const baselineResult = await runStep(baselineUrl, step, baselineVars)
      const candidateResult = await runStep(candidateUrl, step, candidateVars)

      const statusMismatch = baselineResult.status !== candidateResult.status
      let differences: string[] = []
      let bodyMismatch = false

      if (baselineResult.bodyJson && candidateResult.bodyJson) {
        differences = diffJson(baselineResult.bodyJson, candidateResult.bodyJson)
        bodyMismatch = differences.length > 0
      } else {
        bodyMismatch = baselineResult.bodyText.trim() !== candidateResult.bodyText.trim()
        if (bodyMismatch) {
          differences = ['Body text differs']
        }
      }

      nextResults.push({
        name,
        request: {
          method,
          url: joinUrl(baselineUrl, step.path),
        },
        baseline: baselineResult,
        candidate: candidateResult,
        diff: {
          statusMismatch,
          bodyMismatch,
          differences,
        },
      })
    }

    setResults(nextResults)
    setIsRunning(false)
  }

  const runStep = async (baseUrl: string, step: ScenarioStep, vars: Record<string, string>): Promise<ResponseResult> => {
    const method = (step.method || 'GET').toUpperCase()
    const url = joinUrl(baseUrl, step.path)
    const headers = applyVariables(step.headers || {}, vars) as Record<string, string>
    const bodyValue = applyVariables(step.body, vars)

    let body: string | undefined
    if (bodyValue !== undefined && bodyValue !== null && method !== 'GET' && method !== 'HEAD') {
      if (typeof bodyValue === 'string') {
        body = bodyValue
      } else {
        body = JSON.stringify(bodyValue)
        if (!headers['Content-Type']) {
          headers['Content-Type'] = 'application/json'
        }
      }
    }

    const start = performance.now()

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        mode: 'cors',
      })
      const text = await response.text()
      const durationMs = performance.now() - start

      const contentType = response.headers.get('content-type') || ''
      const parsedJson = contentType.includes('application/json') ? safeJsonParse(text) : { ok: false }
      const bodyJson = parsedJson.ok ? parsedJson.data : undefined

      if (bodyJson && step.extract) {
        Object.entries(step.extract).forEach(([key, path]) => {
          const value = getValueByPath(bodyJson, path)
          if (value !== undefined) {
            vars[key] = typeof value === 'string' ? value : JSON.stringify(value)
          }
        })
      }

      return {
        ok: response.ok,
        status: response.status,
        durationMs,
        bodyText: text,
        bodyJson,
      }
    } catch (err) {
      return {
        ok: false,
        durationMs: performance.now() - start,
        bodyText: '',
        error: err instanceof Error ? err.message : t('apiScenario.error.unknown'),
      }
    }
  }

  const handleClear = () => {
    setBaselineUrl('')
    setCandidateUrl('')
    setScenarioText('')
    setVarsText('')
    setResults([])
    setError('')
    setIsRunning(false)
  }

  const summaryText = useMemo(() => {
    if (results.length === 0) return ''
    return `Scenario Summary\n${results
      .map((result, index) => {
        const statusLine = `${result.baseline.status ?? 'ERR'} → ${result.candidate.status ?? 'ERR'}`
        const mismatch = result.diff.statusMismatch || result.diff.bodyMismatch ? 'DIFF' : 'OK'
        return `${index + 1}. ${result.name} | ${statusLine} | ${mismatch}`
      })
      .join('\n')}`
  }, [results])

  const mismatchCount = results.filter((result) => result.diff.statusMismatch || result.diff.bodyMismatch).length

  return (
    <>
    <ToolSchemas toolKey="api-scenario" toolPath="/api-scenario" categoryKey="category.workflow" categoryType="testing" />
    <ToolCard
      title={`🧭 ${t('apiScenario.title')}`}
      description={t('apiScenario.description')}
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('apiScenario.baseUrl')}
            </label>
            <input
              value={baselineUrl}
              onChange={(e) => setBaselineUrl(e.target.value)}
              placeholder="https://api.staging.example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('apiScenario.candidateUrl')}
            </label>
            <input
              value={candidateUrl}
              onChange={(e) => setCandidateUrl(e.target.value)}
              placeholder="https://api.candidate.example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('apiScenario.scenario.label')}
            </label>
            <textarea
              value={scenarioText}
              onChange={(e) => setScenarioText(e.target.value)}
              rows={10}
              placeholder={t('apiScenario.scenario.placeholder')}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('apiScenario.variables.label')}
            </label>
            <textarea
              value={varsText}
              onChange={(e) => setVarsText(e.target.value)}
              rows={10}
              placeholder={t('apiScenario.variables.placeholder')}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={runScenario}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg"
          >
            {isRunning ? t('apiScenario.running') : t('apiScenario.run')}
          </button>
          <button
            onClick={() => {
              setScenarioText(SAMPLE_SCENARIO)
              setVarsText(SAMPLE_VARS)
            }}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            {t('apiScenario.loadSample')}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            {t('apiScenario.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>{t('apiScenario.summary.steps', { count: results.length })}</span>
              <span>{t('apiScenario.summary.mismatches', { count: mismatchCount })}</span>
            </div>
            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold text-gray-800 dark:text-gray-200">{result.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {result.baseline.status ?? 'ERR'} ({result.baseline.durationMs.toFixed(0)}ms) →{' '}
                      {result.candidate.status ?? 'ERR'} ({result.candidate.durationMs.toFixed(0)}ms)
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {result.diff.statusMismatch || result.diff.bodyMismatch
                      ? t('apiScenario.diff.detected')
                      : t('apiScenario.diff.none')}
                  </div>
                  {result.diff.differences.length > 0 && (
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      {result.diff.differences.slice(0, 6).map((diff) => (
                        <div key={diff}>{diff}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <TextAreaWithCopy
              label={t('apiScenario.summary.report')}
              value={summaryText}
              readOnly
              rows={6}
            />
          </div>
        )}
      </div>
    </ToolCard>
    </>
  )
}
