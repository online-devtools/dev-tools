'use client'

import { useMemo, useState } from 'react'
import { parse } from 'graphql'
import yaml from 'js-yaml'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { parseHeaderLines } from '@/utils/apiResponseTime'
import ToolSchemas from './ToolSchemas'

const SAMPLE_OPENAPI = `openapi: 3.0.3
info:
  title: Sample API
  version: 1.0.0
paths:
  /health:
    get:
      summary: Health check
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                  timestamp:
                    type: string
                required: [status]
`

const SAMPLE_GRAPHQL_QUERY = `query Viewer {
  viewer {
    id
    name
  }
}`

type OpenApiOperation = {
  id: string
  path: string
  method: string
  summary?: string
}

type ValidationResult = {
  ok: boolean
  errors: string[]
}

const safeJsonParse = (value: string): { ok: boolean; data?: unknown; error?: string } => {
  try {
    return { ok: true, data: JSON.parse(value) }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Invalid JSON' }
  }
}

const parseSpec = (value: string): { ok: boolean; data?: any; error?: string } => {
  try {
    return { ok: true, data: JSON.parse(value) }
  } catch (jsonError) {
    try {
      const data = yaml.load(value)
      return { ok: true, data }
    } catch (yamlError) {
      return { ok: false, error: yamlError instanceof Error ? yamlError.message : 'Invalid spec' }
    }
  }
}

const buildOperations = (spec: any): OpenApiOperation[] => {
  const paths = spec?.paths || {}
  const operations: OpenApiOperation[] = []
  Object.entries(paths).forEach(([path, methods]) => {
    if (!methods || typeof methods !== 'object') return
    Object.entries(methods as Record<string, any>).forEach(([method, operation]) => {
      const normalized = method.toUpperCase()
      if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].includes(normalized)) return
      operations.push({
        id: `${normalized} ${path}`,
        path,
        method: normalized,
        summary: operation?.summary || operation?.operationId,
      })
    })
  })
  return operations
}

const resolveRef = (spec: any, schema: any): any => {
  if (!schema || typeof schema !== 'object') return schema
  if (!schema.$ref || typeof schema.$ref !== 'string') return schema
  if (!schema.$ref.startsWith('#/')) return schema

  const refPath = schema.$ref.slice(2).split('/')
  let current: any = spec
  for (const key of refPath) {
    current = current?.[key]
    if (!current) {
      return schema
    }
  }

  return current
}

const validateSchema = (spec: any, schema: any, data: any, path: string, errors: string[], depth = 0) => {
  if (!schema || depth > 6) return
  const resolved = resolveRef(spec, schema)

  if (resolved?.nullable && data === null) return

  if (resolved?.enum && Array.isArray(resolved.enum)) {
    if (!resolved.enum.includes(data)) {
      errors.push(`${path}: expected one of ${resolved.enum.join(', ')}`)
      return
    }
  }

  if (resolved?.oneOf && Array.isArray(resolved.oneOf)) {
    const matches = resolved.oneOf.some((candidate: any) => {
      const candidateErrors: string[] = []
      validateSchema(spec, candidate, data, path, candidateErrors, depth + 1)
      return candidateErrors.length === 0
    })
    if (!matches) {
      errors.push(`${path}: does not match any oneOf schema`)
    }
    return
  }

  if (resolved?.anyOf && Array.isArray(resolved.anyOf)) {
    const matches = resolved.anyOf.some((candidate: any) => {
      const candidateErrors: string[] = []
      validateSchema(spec, candidate, data, path, candidateErrors, depth + 1)
      return candidateErrors.length === 0
    })
    if (!matches) {
      errors.push(`${path}: does not match any anyOf schema`)
    }
    return
  }

  if (resolved?.allOf && Array.isArray(resolved.allOf)) {
    resolved.allOf.forEach((candidate: any) => validateSchema(spec, candidate, data, path, errors, depth + 1))
    return
  }

  const typeValue = resolved?.type
  const types = Array.isArray(typeValue) ? typeValue : typeValue ? [typeValue] : []
  const actualType = Array.isArray(data) ? 'array' : data === null ? 'null' : typeof data

  if (types.length > 0 && !types.includes(actualType)) {
    errors.push(`${path}: expected ${types.join('|')} but got ${actualType}`)
    return
  }

  if (actualType === 'object' && data && !Array.isArray(data)) {
    const required = Array.isArray(resolved?.required) ? resolved.required : []
    required.forEach((key: string) => {
      if (!(key in data)) {
        errors.push(`${path}.${key}: required`)
      }
    })

    const properties = resolved?.properties || {}
    Object.entries(properties).forEach(([key, childSchema]) => {
      if (key in data) {
        validateSchema(spec, childSchema, data[key], `${path}.${key}`, errors, depth + 1)
      }
    })
  }

  if (actualType === 'array' && Array.isArray(data)) {
    const items = resolved?.items
    if (items) {
      data.forEach((item, index) => {
        validateSchema(spec, items, item, `${path}[${index}]`, errors, depth + 1)
      })
    }
  }
}

const pickResponseSchema = (operation: any, status: number) => {
  const responses = operation?.responses || {}
  const statusKey = responses[status]
    ? String(status)
    : Object.keys(responses).find((key) => key.startsWith('2')) ||
    Object.keys(responses).find((key) => key === 'default') ||
    Object.keys(responses)[0]

  const response = statusKey ? responses[statusKey] : undefined
  const content = response?.content || {}
  return (
    content['application/json']?.schema ||
    content['application/problem+json']?.schema ||
    content['application/vnd.api+json']?.schema
  )
}

const extractGraphQLFields = (query: string): string[] => {
  try {
    const doc = parse(query)
    const fields = new Set<string>()
    doc.definitions.forEach((definition) => {
      if (definition.kind === 'OperationDefinition') {
        definition.selectionSet.selections.forEach((selection) => {
          if (selection.kind === 'Field') {
            fields.add(selection.name.value)
          }
        })
      }
    })
    return Array.from(fields)
  } catch {
    return []
  }
}

export default function ApiContractTesterTool() {
  const { t } = useLanguage()
  const [mode, setMode] = useState<'openapi' | 'graphql'>('openapi')
  const [specText, setSpecText] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [operationId, setOperationId] = useState('')
  const [operations, setOperations] = useState<OpenApiOperation[]>([])
  const [pathOverride, setPathOverride] = useState('')
  const [headersText, setHeadersText] = useState('Accept: application/json')
  const [requestBody, setRequestBody] = useState('')
  const [graphqlQuery, setGraphqlQuery] = useState('')
  const [graphqlVariables, setGraphqlVariables] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [responseText, setResponseText] = useState('')
  const [error, setError] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [spec, setSpec] = useState<any | null>(null)

  const handleParseSpec = () => {
    const parseResult = parseSpec(specText)
    if (!parseResult.ok) {
      setError(t('apiContract.error.spec'))
      return
    }

    const nextSpec = parseResult.data
    const nextOperations = buildOperations(nextSpec)
    if (nextOperations.length === 0) {
      setError(t('apiContract.error.noOperations'))
      return
    }

    setSpec(nextSpec)
    setOperations(nextOperations)
    setOperationId(nextOperations[0].id)
    setError('')
  }

  const runOpenApi = async () => {
    if (!spec) {
      setError(t('apiContract.error.noSpec'))
      return
    }

    const selected = operations.find((operation) => operation.id === operationId)
    if (!selected) {
      setError(t('apiContract.error.noOperation'))
      return
    }

    const method = selected.method
    const path = pathOverride.trim() || selected.path
    const url = `${baseUrl.replace(/\/+$/, '')}${path.startsWith('/') ? path : `/${path}`}`
    const headers = parseHeaderLines(headersText)

    let body: string | undefined
    if (requestBody.trim() && method !== 'GET' && method !== 'HEAD') {
      const parsedBody = safeJsonParse(requestBody)
      body = parsedBody.ok ? JSON.stringify(parsedBody.data) : requestBody
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json'
      }
    }

    setIsRunning(true)
    setError('')
    setResult(null)

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
      setResponseText(text)

      const parseResult = safeJsonParse(text)
      const schema = pickResponseSchema(spec.paths[selected.path]?.[method.toLowerCase()], response.status)
      const errors: string[] = []

      if (schema && parseResult.ok) {
        validateSchema(spec, schema, parseResult.data, '$', errors)
      }

      setResult({
        ok: response.ok && errors.length === 0,
        errors: errors.length > 0 ? errors : [t('apiContract.ok', { status: response.status, duration: Math.round(durationMs) })],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('apiContract.error.unknown'))
    } finally {
      setIsRunning(false)
    }
  }

  const runGraphql = async () => {
    if (!baseUrl.trim()) {
      setError(t('apiContract.error.baseUrl'))
      return
    }

    setIsRunning(true)
    setError('')
    setResult(null)

    const headers = parseHeaderLines(headersText)
    headers['Content-Type'] = 'application/json'

    const variablesParse = graphqlVariables.trim() ? safeJsonParse(graphqlVariables) : { ok: true, data: {} }
    if (!variablesParse.ok) {
      setError(t('apiContract.error.variables'))
      setIsRunning(false)
      return
    }

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: graphqlQuery,
          variables: variablesParse.data,
        }),
        mode: 'cors',
      })
      const text = await response.text()
      setResponseText(text)

      const parsed = safeJsonParse(text)
      if (!parsed.ok) {
        setResult({ ok: false, errors: [t('apiContract.error.responseJson')] })
        setIsRunning(false)
        return
      }

      const data = parsed.data as any
      const errors: string[] = []
      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        data.errors.forEach((err: any) => errors.push(err.message || t('apiContract.error.graphql')))
      }

      const fields = extractGraphQLFields(graphqlQuery)
      fields.forEach((field) => {
        if (!data?.data || !(field in data.data)) {
          errors.push(t('apiContract.error.missingField', { field }))
        }
      })

      setResult({ ok: errors.length === 0, errors: errors.length ? errors : [t('apiContract.ok.graphql')] })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('apiContract.error.unknown'))
    } finally {
      setIsRunning(false)
    }
  }

  const handleRun = () => {
    if (mode === 'openapi') {
      runOpenApi()
    } else {
      runGraphql()
    }
  }

  const responsePreview = useMemo(() => {
    if (!responseText) return ''
    const parsed = safeJsonParse(responseText)
    if (parsed.ok) {
      return JSON.stringify(parsed.data, null, 2)
    }
    return responseText
  }, [responseText])

  return (
    <>

      <ToolCard
        title={`📜 ${t('apiContract.title')}`}
        description={t('apiContract.description')}
      >
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setMode('openapi')}
              className={`px-4 py-2 rounded-lg ${mode === 'openapi'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
            >
              OpenAPI
            </button>
            <button
              onClick={() => setMode('graphql')}
              className={`px-4 py-2 rounded-lg ${mode === 'graphql'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
            >
              GraphQL
            </button>
          </div>

          {mode === 'openapi' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('apiContract.spec.label')}
                </label>
                <textarea
                  value={specText}
                  onChange={(e) => setSpecText(e.target.value)}
                  rows={8}
                  placeholder={t('apiContract.spec.placeholder')}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleParseSpec}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                >
                  {t('apiContract.spec.parse')}
                </button>
                <button
                  onClick={() => setSpecText(SAMPLE_OPENAPI)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                >
                  {t('apiContract.loadSample')}
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('apiContract.baseUrl')}
              </label>
              <input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder={mode === 'openapi' ? 'https://api.example.com' : 'https://api.example.com/graphql'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            {mode === 'openapi' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('apiContract.operation')}
                </label>
                <select
                  value={operationId}
                  onChange={(e) => setOperationId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {operations.map((operation) => (
                    <option key={operation.id} value={operation.id}>
                      {operation.id}{operation.summary ? ` - ${operation.summary}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {mode === 'openapi' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('apiContract.pathOverride')}
              </label>
              <input
                value={pathOverride}
                onChange={(e) => setPathOverride(e.target.value)}
                placeholder={t('apiContract.pathOverride.placeholder')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('apiContract.headers')}
            </label>
            <textarea
              value={headersText}
              onChange={(e) => setHeadersText(e.target.value)}
              rows={4}
              placeholder="Authorization: Bearer ..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
            />
          </div>

          {mode === 'openapi' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('apiContract.requestBody')}
              </label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={6}
                placeholder={t('apiContract.requestBody.placeholder')}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
              />
            </div>
          )}

          {mode === 'graphql' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('apiContract.graphql.query')}
                </label>
                <textarea
                  value={graphqlQuery}
                  onChange={(e) => setGraphqlQuery(e.target.value)}
                  rows={6}
                  placeholder={t('apiContract.graphql.query.placeholder')}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setGraphqlQuery(SAMPLE_GRAPHQL_QUERY)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                >
                  {t('apiContract.loadSample')}
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('apiContract.graphql.variables')}
                </label>
                <textarea
                  value={graphqlVariables}
                  onChange={(e) => setGraphqlVariables(e.target.value)}
                  rows={4}
                  placeholder={t('apiContract.graphql.variables.placeholder')}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg"
            >
              {isRunning ? t('apiContract.running') : t('apiContract.run')}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-2">
              <div className={`p-3 rounded-lg text-sm ${result.ok ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                {result.errors.map((item) => (
                  <div key={item}>{item}</div>
                ))}
              </div>
            </div>
          )}

          {responseText && (
            <TextAreaWithCopy
              label={t('apiContract.response')}
              value={responsePreview}
              readOnly
              rows={8}
            />
          )}
        </div>
      </ToolCard>
    </>
  )
}
