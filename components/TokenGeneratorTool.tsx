'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function TokenGeneratorTool() {
  const [length, setLength] = useState('32')
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(false)
  const [output, setOutput] = useState('')

  const generateToken = () => {
    try {
      const len = parseInt(length)
      if (isNaN(len) || len < 1 || len > 10000) {
        setOutput('길이는 1에서 10000 사이여야 합니다.')
        return
      }

      let chars = ''
      if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
      if (numbers) chars += '0123456789'
      if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

      if (chars.length === 0) {
        setOutput('최소 하나의 문자 유형을 선택해주세요.')
        return
      }

      let token = ''
      const array = new Uint32Array(len)
      crypto.getRandomValues(array)

      for (let i = 0; i < len; i++) {
        token += chars[array[i] % chars.length]
      }

      setOutput(token)
    } catch (error) {
      setOutput('토큰 생성 중 오류가 발생했습니다.')
    }
  }

  return (
    <ToolCard
      title="Token Generator"
      description="원하는 문자 조합으로 랜덤 토큰과 문자열을 생성합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            길이
          </label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="1"
            max="10000"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            문자 유형
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">대문자 (A-Z)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">소문자 (a-z)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={numbers}
                onChange={(e) => setNumbers(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">숫자 (0-9)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={symbols}
                onChange={(e) => setSymbols(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">특수문자</span>
            </label>
          </div>
        </div>

        <button
          onClick={generateToken}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          생성
        </button>

        <TextAreaWithCopy
          value={output}
          readOnly
          label="생성된 토큰"
        />
      </div>
    </ToolCard>
  )
}
