'use client'

import { useState, useEffect } from 'react'
import ToolCard from './ToolCard'

export default function URLParserTool() {
  const [input, setInput] = useState('')
  const [parsed, setParsed] = useState<any>(null)

  useEffect(() => {
    if (!input) {
      setParsed(null)
      return
    }

    try {
      const url = new URL(input)
      const params: { [key: string]: string } = {}
      url.searchParams.forEach((value, key) => {
        params[key] = value
      })

      setParsed({
        href: url.href,
        protocol: url.protocol,
        username: url.username,
        password: url.password,
        hostname: url.hostname,
        port: url.port,
        host: url.host,
        origin: url.origin,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        params: params,
      })
    } catch {
      setParsed(null)
    }
  }, [input])

  const InfoRow = ({ label, value }: { label: string; value: string }) => {
    if (!value) return null
    return (
      <div className="flex justify-between items-start p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">{label}</span>
        <span className="text-gray-900 dark:text-white font-mono text-sm break-all text-right">{value}</span>
      </div>
    )
  }

  return (
    <ToolCard
      title="URL Parser"
      description="URL을 구성 요소별로 분석합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URL 입력
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
            placeholder="https://example.com:8080/path?key=value#hash"
          />
        </div>

        {parsed && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">분석 결과</h3>
            <InfoRow label="Full URL" value={parsed.href} />
            <InfoRow label="Protocol" value={parsed.protocol} />
            <InfoRow label="Origin" value={parsed.origin} />
            <InfoRow label="Hostname" value={parsed.hostname} />
            <InfoRow label="Port" value={parsed.port} />
            <InfoRow label="Pathname" value={parsed.pathname} />
            <InfoRow label="Search" value={parsed.search} />
            <InfoRow label="Hash" value={parsed.hash} />
            {parsed.username && <InfoRow label="Username" value={parsed.username} />}
            {parsed.password && <InfoRow label="Password" value="●●●●●●" />}

            {Object.keys(parsed.params).length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Query Parameters</h4>
                <div className="space-y-2">
                  {Object.entries(parsed.params).map(([key, value]) => (
                    <InfoRow key={key} label={key} value={value as string} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!parsed && input && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
            올바른 URL 형식이 아닙니다.
          </div>
        )}
      </div>
    </ToolCard>
  )
}
