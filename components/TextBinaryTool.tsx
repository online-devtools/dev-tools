'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function TextBinaryTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const textToBinary = () => {
    try {
      setError('')
      const binary = input
        .split('')
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ')
      setOutput(binary)
    } catch (err: any) {
      setError(`변환 오류: ${err.message}`)
      setOutput('')
    }
  }

  const binaryToText = () => {
    try {
      setError('')
      const text = input
        .split(/\s+/)
        .map(bin => String.fromCharCode(parseInt(bin, 2)))
        .join('')
      setOutput(text)
    } catch (err: any) {
      setError(`변환 오류: ${err.message}`)
      setOutput('')
    }
  }

  return (
    <ToolCard
      title="Text to ASCII Binary"
      description="텍스트와 ASCII 이진수를 상호 변환합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label="입력"
          placeholder="Hello 또는 01001000 01100101 01101100 01101100 01101111"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={textToBinary}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Text → Binary
          </button>
          <button
            onClick={binaryToText}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Binary → Text
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          readOnly
          label="출력"
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">예시</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• "A" → "01000001"</li>
            <li>• "Hello" → "01001000 01100101 01101100 01101100 01101111"</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
