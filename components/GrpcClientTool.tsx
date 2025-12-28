'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { parseHeaderLines } from '@/utils/apiResponseTime'

const SAMPLE_REQUEST = `{
  "id": "1234"
}`

const quoteForShell = (value: string) => {
  const escaped = value.replace(/'/g, `'"'"'`)
  return `'${escaped}'`
}

const safeJsonParse = (value: string): { ok: boolean; data?: unknown } => {
  try {
    return { ok: true, data: JSON.parse(value) }
  } catch {
    return { ok: false }
  }
}

export default function GrpcClientTool() {
  const { t } = useLanguage()
  const [target, setTarget] = useState('localhost:50051')
  const [method, setMethod] = useState('package.Service/Method')
  const [useTls, setUseTls] = useState(true)
  const [insecure, setInsecure] = useState(false)
  const [headersText, setHeadersText] = useState('')
  const [requestJson, setRequestJson] = useState('')
  const [importPath, setImportPath] = useState('')
  const [protoFile, setProtoFile] = useState('')
  const [responseText, setResponseText] = useState('')

  const grpcurlCommand = useMemo(() => {
    const parts = ['grpcurl']
    if (!useTls) {
      parts.push('-plaintext')
    } else if (insecure) {
      parts.push('-insecure')
    }

    if (importPath.trim()) {
      parts.push('-import-path', quoteForShell(importPath.trim()))
    }
    if (protoFile.trim()) {
      parts.push('-proto', quoteForShell(protoFile.trim()))
    }

    const headers = parseHeaderLines(headersText)
    Object.entries(headers).forEach(([key, value]) => {
      parts.push('-H', quoteForShell(`${key}: ${value}`))
    })

    if (requestJson.trim()) {
      parts.push('-d', quoteForShell(requestJson.trim()))
    }

    parts.push(target.trim() || 'localhost:50051')
    parts.push(method.trim() || 'package.Service/Method')

    return parts.join(' ')
  }, [useTls, insecure, importPath, protoFile, headersText, requestJson, target, method])

  const responsePreview = useMemo(() => {
    if (!responseText) return ''
    const parsed = safeJsonParse(responseText)
    if (parsed.ok) {
      return JSON.stringify(parsed.data, null, 2)
    }
    return responseText
  }, [responseText])

  return (
    <ToolCard
      title={`📡 ${t('grpcClient.title')}`}
      description={t('grpcClient.description')}
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('grpcClient.target')}
            </label>
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="localhost:50051"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('grpcClient.method')}
            </label>
            <input
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              placeholder="package.Service/Method"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={useTls} onChange={(e) => setUseTls(e.target.checked)} />
            {t('grpcClient.tls')}
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={insecure}
              onChange={(e) => setInsecure(e.target.checked)}
              disabled={!useTls}
            />
            {t('grpcClient.insecure')}
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('grpcClient.importPath')}
            </label>
            <input
              value={importPath}
              onChange={(e) => setImportPath(e.target.value)}
              placeholder="./protos"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('grpcClient.protoFile')}
            </label>
            <input
              value={protoFile}
              onChange={(e) => setProtoFile(e.target.value)}
              placeholder="service.proto"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('grpcClient.headers')}
          </label>
          <textarea
            value={headersText}
            onChange={(e) => setHeadersText(e.target.value)}
            rows={3}
            placeholder="authorization: Bearer ..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('grpcClient.request')}
          </label>
          <textarea
            value={requestJson}
            onChange={(e) => setRequestJson(e.target.value)}
            rows={5}
            placeholder={t('grpcClient.request.placeholder')}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
          <button
            onClick={() => setRequestJson(SAMPLE_REQUEST)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            {t('grpcClient.loadSample')}
          </button>
        </div>

        <TextAreaWithCopy
          label={t('grpcClient.command')}
          value={grpcurlCommand}
          readOnly
          rows={4}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('grpcClient.response')}
          </label>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            rows={6}
            placeholder={t('grpcClient.response.placeholder')}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
        </div>

        {responseText && (
          <TextAreaWithCopy
            label={t('grpcClient.responsePretty')}
            value={responsePreview}
            readOnly
            rows={6}
          />
        )}
      </div>
    </ToolCard>
  )
}
