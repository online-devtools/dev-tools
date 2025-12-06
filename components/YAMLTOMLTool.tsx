'use client'

import { useState } from 'react'
import * as yaml from 'js-yaml'
import * as TOML from '@iarna/toml'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function YAMLTOMLTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const yamlToToml = () => {
    try {
      setError('')
      const obj = yaml.load(input)
      const tomlStr = TOML.stringify(obj as any)
      setOutput(tomlStr)
    } catch (err: any) {
      setError(`변환 오류: ${err.message}`)
      setOutput('')
    }
  }

  const tomlToYaml = () => {
    try {
      setError('')
      const obj = TOML.parse(input)
      const yamlStr = yaml.dump(obj)
      setOutput(yamlStr)
    } catch (err: any) {
      setError(`변환 오류: ${err.message}`)
      setOutput('')
    }
  }

  return (
    <ToolCard
      title="YAML ↔ TOML Converter"
      description="YAML과 TOML 형식을 상호 변환합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label="입력"
          placeholder="YAML 또는 TOML 입력"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={yamlToToml}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            YAML → TOML
          </button>
          <button
            onClick={tomlToYaml}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            TOML → YAML
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
