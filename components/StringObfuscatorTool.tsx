'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function StringObfuscatorTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [visibleStart, setVisibleStart] = useState('4')
  const [visibleEnd, setVisibleEnd] = useState('4')
  const [maskChar, setMaskChar] = useState('*')

  const obfuscate = () => {
    try {
      if (!input) {
        setOutput('')
        return
      }

      const start = parseInt(visibleStart) || 0
      const end = parseInt(visibleEnd) || 0

      if (start + end >= input.length) {
        setOutput(input)
        return
      }

      const startPart = input.slice(0, start)
      const endPart = input.slice(-end || input.length)
      const middleLength = input.length - start - end
      const masked = maskChar.repeat(middleLength)

      setOutput(startPart + masked + endPart)
    } catch (error) {
      setOutput('난독화 중 오류가 발생했습니다.')
    }
  }

  return (
    <ToolCard
      title="String Obfuscator"
      description="민감한 문자열을 부분적으로 숨겨 안전하게 공유합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label="입력 문자열"
          placeholder="example_api_key_1234567890abcdefgh"
        />

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              앞에서 표시할 문자 수
            </label>
            <input
              type="number"
              value={visibleStart}
              onChange={(e) => setVisibleStart(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              뒤에서 표시할 문자 수
            </label>
            <input
              type="number"
              value={visibleEnd}
              onChange={(e) => setVisibleEnd(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              마스킹 문자
            </label>
            <input
              type="text"
              value={maskChar}
              onChange={(e) => setMaskChar(e.target.value.slice(0, 1) || '*')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              maxLength={1}
            />
          </div>
        </div>

        <button
          onClick={obfuscate}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          난독화
        </button>

        <TextAreaWithCopy
          value={output}
          readOnly
          label="난독화된 문자열"
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">사용 예시</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• API 키: "sk_live_1234..." → "sk_l****************1234"</li>
            <li>• IBAN: "GB82 WEST 1234..." → "GB82****************1234"</li>
            <li>• 이메일: "user@example.com" → "use***@example.com"</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
