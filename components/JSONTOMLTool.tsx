'use client'

import { useState } from 'react'
import * as TOML from '@iarna/toml'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function JSONTOMLTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const jsonToToml = () => {
    try {
      setError('')
      const obj = JSON.parse(input)
      const tomlStr = TOML.stringify(obj)
      setOutput(tomlStr)
    } catch (err: any) {
      setError(`변환 오류: ${err.message}`)
      setOutput('')
    }
  }

  const tomlToJson = () => {
    try {
      setError('')
      const obj = TOML.parse(input)
      const jsonStr = JSON.stringify(obj, null, 2)
      setOutput(jsonStr)
    } catch (err: any) {
      setError(`변환 오류: ${err.message}`)
      setOutput('')
    }
  }

  return (
    <ToolCard
      title="JSON ↔ TOML Converter"
      description="JSON과 TOML 형식을 상호 변환합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label="입력"
          placeholder="JSON 또는 TOML 입력"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={jsonToToml}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            JSON → TOML
          </button>
          <button
            onClick={tomlToJson}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            TOML → JSON
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
      </div>
    </ToolCard>
  )
}
