'use client'

import { useState } from 'react'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function XMLJSONTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const xmlToJson = () => {
    try {
      setError('')
      const parser = new XMLParser()
      const obj = parser.parse(input)
      const jsonStr = JSON.stringify(obj, null, 2)
      setOutput(jsonStr)
    } catch (err: any) {
      setError(`변환 오류: ${err.message}`)
      setOutput('')
    }
  }

  const jsonToXml = () => {
    try {
      setError('')
      const obj = JSON.parse(input)
      const builder = new XMLBuilder({ format: true })
      const xmlStr = builder.build(obj)
      setOutput(xmlStr)
    } catch (err: any) {
      setError(`변환 오류: ${err.message}`)
      setOutput('')
    }
  }

  return (
    <ToolCard
      title="XML ↔ JSON Converter"
      description="XML과 JSON 형식을 상호 변환합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label="입력"
          placeholder="XML 또는 JSON 입력"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={xmlToJson}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            XML → JSON
          </button>
          <button
            onClick={jsonToXml}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            JSON → XML
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
