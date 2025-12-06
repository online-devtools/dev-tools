'use client'

import { useState } from 'react'
import { ulid } from 'ulid'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function ULIDTool() {
  const [output, setOutput] = useState('')
  const [count, setCount] = useState('1')

  const generateULID = () => {
    try {
      const num = parseInt(count)
      if (isNaN(num) || num < 1 || num > 1000) {
        setOutput('개수는 1에서 1000 사이여야 합니다.')
        return
      }

      const ulids: string[] = []
      for (let i = 0; i < num; i++) {
        ulids.push(ulid())
      }

      setOutput(ulids.join('\n'))
    } catch (error) {
      setOutput('ULID 생성 중 오류가 발생했습니다.')
    }
  }

  return (
    <ToolCard
      title="ULID Generator"
      description="시간순으로 정렬 가능한 고유 식별자를 생성합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            생성 개수
          </label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="1"
            max="1000"
          />
        </div>

        <button
          onClick={generateULID}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          생성
        </button>

        <TextAreaWithCopy
          value={output}
          readOnly
          label="생성된 ULID"
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">ULID란?</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• 128비트 크기의 고유 식별자</li>
            <li>• 시간순으로 정렬 가능 (타임스탬프 포함)</li>
            <li>• UUID v4와 호환 가능</li>
            <li>• URL-safe, 대소문자 구분 없음</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
