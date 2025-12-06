'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function BasicAuthTool() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [output, setOutput] = useState('')

  const generate = () => {
    if (!username || !password) {
      setOutput('사용자명과 비밀번호를 모두 입력해주세요.')
      return
    }

    const credentials = `${username}:${password}`
    const base64 = btoa(credentials)
    const header = `Basic ${base64}`

    setOutput(header)
  }

  const decode = (header: string) => {
    try {
      const base64 = header.replace(/^Basic\s+/, '')
      const decoded = atob(base64)
      const [user, pass] = decoded.split(':')
      setUsername(user || '')
      setPassword(pass || '')
      setOutput(header)
    } catch (err) {
      setOutput('올바른 Basic Auth 헤더가 아닙니다.')
    }
  }

  return (
    <ToolCard
      title="Basic Auth Generator"
      description="HTTP 기본 인증 헤더를 생성합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            사용자명
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="password"
          />
        </div>

        <button
          onClick={generate}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          생성
        </button>

        <TextAreaWithCopy
          value={output}
          readOnly
          label="Authorization 헤더"
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">사용 방법</h3>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <div>• HTTP 헤더에 추가: Authorization: {output || 'Basic <base64>'}</div>
            <div>• curl 예시: curl -H "Authorization: {output || 'Basic <base64>'}" URL</div>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
