'use client'

import { useState } from 'react'
import * as yaml from 'js-yaml'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function YAMLJSONTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const yamlToJson = () => {
    try {
      setError('')
      const obj = yaml.load(input)
      const json = JSON.stringify(obj, null, 2)
      setOutput(json)
    } catch (err: any) {
      setError(`변환 오류: ${err.message}`)
      setOutput('')
    }
  }

  const jsonToYaml = () => {
    try {
      setError('')
      const obj = JSON.parse(input)
      const yamlStr = yaml.dump(obj)
      setOutput(yamlStr)
    } catch (err: any) {
      setError(`변환 오류: ${err.message}`)
      setOutput('')
    }
  }

  return (
    <ToolCard
      title="YAML ↔ JSON Converter"
      description="YAML과 JSON 형식을 상호 변환합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label="입력"
          placeholder="YAML 또는 JSON 입력"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={yamlToJson}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            YAML → JSON
          </button>
          <button
            onClick={jsonToYaml}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            JSON → YAML
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
