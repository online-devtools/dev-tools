'use client'

import { useState, useEffect } from 'react'
import { UAParser } from 'ua-parser-js'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function UserAgentTool() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    // Set current user agent as default
    setInput(navigator.userAgent)
    parse(navigator.userAgent)
  }, [])

  const parse = (ua: string) => {
    if (!ua) {
      setResult(null)
      return
    }

    const parser = new UAParser(ua)
    setResult(parser.getResult())
  }

  return (
    <ToolCard
      title="User Agent Parser"
      description="User Agent 문자열을 파싱합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={(value) => {
            setInput(value)
            parse(value)
          }}
          label="User Agent 문자열"
          placeholder="Mozilla/5.0..."
        />

        {result && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">브라우저</h3>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div><strong>이름:</strong> {result.browser.name || 'Unknown'}</div>
                <div><strong>버전:</strong> {result.browser.version || 'Unknown'}</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">운영체제</h3>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div><strong>이름:</strong> {result.os.name || 'Unknown'}</div>
                <div><strong>버전:</strong> {result.os.version || 'Unknown'}</div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">기기</h3>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div><strong>타입:</strong> {result.device.type || 'Desktop'}</div>
                <div><strong>제조사:</strong> {result.device.vendor || 'Unknown'}</div>
                <div><strong>모델:</strong> {result.device.model || 'Unknown'}</div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">엔진</h3>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div><strong>이름:</strong> {result.engine.name || 'Unknown'}</div>
                <div><strong>버전:</strong> {result.engine.version || 'Unknown'}</div>
              </div>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">CPU</h3>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div><strong>아키텍처:</strong> {result.cpu.architecture || 'Unknown'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
