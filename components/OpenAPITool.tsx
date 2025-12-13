'use client'

import { useState } from 'react'
import yaml from 'js-yaml'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type ParsedApi = {
  title?: string
  version?: string
  servers?: string[]
  endpoints: Array<{ method: string; path: string; summary?: string }>
}

export default function OpenAPITool() {
  const { t } = useLanguage()
  // 원본 입력, 파싱 결과, 에러 상태를 관리합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<ParsedApi | null>(null)
  const [error, setError] = useState('')

  const parseOpenAPI = () => {
    setError('')
    setOutput(null)

    try {
      if (!input.trim()) {
        setError(t('openapi.error.required'))
        return
      }

      const parsed = yaml.load(input) as any
      if (!parsed || typeof parsed !== 'object') {
        setError(t('openapi.error.invalid'))
        return
      }

      const info = parsed.info || {}
      const paths = parsed.paths || {}
      const servers = Array.isArray(parsed.servers) ? parsed.servers.map((s: any) => s.url).filter(Boolean) : []

      const endpoints: ParsedApi['endpoints'] = []
      Object.entries(paths).forEach(([path, methods]) => {
        if (typeof methods !== 'object') return
        Object.entries(methods as Record<string, any>).forEach(([method, meta]) => {
          if (['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(method.toLowerCase())) {
            endpoints.push({ method: method.toUpperCase(), path, summary: (meta as any)?.summary })
          }
        })
      })

      setOutput({
        title: info.title,
        version: info.version,
        servers,
        endpoints,
      })
    } catch (e) {
      setError(t('openapi.error.parse', { message: e instanceof Error ? e.message : '' }))
    }
  }

  const sampleCurl = output?.endpoints?.[0] && output.servers?.[0]
    ? `curl -X ${output.endpoints[0].method} ${output.servers[0]}${output.endpoints[0].path}`
    : ''

  return (
    <ToolCard
      title={`📜 ${t('openapi.title')}`}
      description={t('openapi.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('openapi.input.label')}
          placeholder={t('openapi.input.placeholder')}
          rows={12}
        />

        <button
          onClick={parseOpenAPI}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('openapi.actions.validate')}
        </button>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {output && (
          <div className="space-y-3">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {t('openapi.result.info', { title: output.title || t('openapi.result.unknown'), version: output.version || '-' })}
              </p>
              {output.servers && output.servers.length > 0 && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {t('openapi.result.servers')}: {output.servers.join(', ')}
                </p>
              )}
            </div>

            {sampleCurl && (
              <TextAreaWithCopy
                value={sampleCurl}
                readOnly
                label={t('openapi.result.sampleCurl')}
                rows={2}
              />
            )}

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                {t('openapi.result.endpoints')} ({output.endpoints.length})
              </h3>
              <div className="space-y-1 text-sm">
                {output.endpoints.map((ep, idx) => (
                  <div key={`${ep.method}-${ep.path}-${idx}`} className="flex justify-between gap-2">
                    <span className="font-mono text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">{ep.method}</span>
                    <span className="flex-1 font-mono text-gray-800 dark:text-gray-100">{ep.path}</span>
                    {ep.summary && <span className="text-gray-600 dark:text-gray-400">{ep.summary}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
