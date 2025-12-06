'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function JSONMinifyTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const minify = () => {
    try {
      setError('')
      const obj = JSON.parse(input)
      setOutput(JSON.stringify(obj))
    } catch (err: any) {
      setError(`오류: ${err.message}`)
      setOutput('')
    }
  }

  const prettify = () => {
    try {
      setError('')
      const obj = JSON.parse(input)
      setOutput(JSON.stringify(obj, null, 2))
    } catch (err: any) {
      setError(`오류: ${err.message}`)
      setOutput('')
    }
  }

  return (
    <ToolCard
      title="JSON Minify"
      description="JSON을 압축하거나 포맷합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label="입력 JSON"
          placeholder='{"name": "John", "age": 30}'
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={minify}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            압축 (Minify)
          </button>
          <button
            onClick={prettify}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            포맷 (Prettify)
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

        {output && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            압축률: {input.length > 0 ? ((1 - output.length / input.length) * 100).toFixed(1) : 0}%
            ({input.length} → {output.length} bytes)
          </div>
        )}
      </div>
    </ToolCard>
  )
}
