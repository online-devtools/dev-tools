'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HttpBuilderTool() {
  const { t } = useLanguage()
  // 요청 메서드, URL, 헤더, 바디, 스니펫을 상태로 관리합니다.
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('https://api.example.com')
  const [headers, setHeaders] = useState('Content-Type: application/json')
  const [body, setBody] = useState('{\n  "name": "Alice"\n}')

  const buildHeadersObject = () => {
    const obj: Record<string, string> = {}
    headers.split('\n').forEach((line) => {
      const [k, ...rest] = line.split(':')
      if (!k || rest.length === 0) return
      obj[k.trim()] = rest.join(':').trim()
    })
    return obj
  }

  const fetchSnippet = `fetch('${url}', {
  method: '${method}',
  headers: ${JSON.stringify(buildHeadersObject(), null, 2)},
  ${method !== 'GET' ? `body: ${body ? body : '""'},` : ''}
})`

  const axiosSnippet = `axios.${method.toLowerCase()}('${url}'${method !== 'GET' ? `, ${body || '{}'},` : ''} {
  headers: ${JSON.stringify(buildHeadersObject(), null, 2)}
})`

  return (
    <ToolCard
      title={`📡 ${t('httpBuilder.title')}`}
      description={t('httpBuilder.description')}
    >
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('httpBuilder.input.method')}
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <TextAreaWithCopy
          value={headers}
          onChange={setHeaders}
          label={t('httpBuilder.input.headers')}
          rows={4}
        />

        {method !== 'GET' && (
          <TextAreaWithCopy
            value={body}
            onChange={setBody}
            label={t('httpBuilder.input.body')}
            rows={4}
          />
        )}

        <TextAreaWithCopy
          value={fetchSnippet}
          readOnly
          label={t('httpBuilder.snippet.fetch')}
          rows={6}
        />
        <TextAreaWithCopy
          value={axiosSnippet}
          readOnly
          label={t('httpBuilder.snippet.axios')}
          rows={6}
        />
      </div>
    </ToolCard>
  )
}
