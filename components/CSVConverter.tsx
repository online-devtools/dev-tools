'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function CSVConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [delimiter, setDelimiter] = useState(',')

  const csvToJSON = () => {
    try {
      setError('')
      if (!input.trim()) {
        setError('CSV 데이터를 입력해주세요.')
        return
      }

      const lines = input.trim().split('\n')
      if (lines.length < 2) {
        setError('최소 헤더와 1개의 데이터 행이 필요합니다.')
        return
      }

      const headers = lines[0].split(delimiter).map(h => h.trim())
      const result = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(delimiter).map(v => v.trim())
        const obj: any = {}

        headers.forEach((header, index) => {
          let value: any = values[index] || ''

          // Try to parse as number
          if (!isNaN(Number(value)) && value !== '') {
            value = Number(value)
          }
          // Try to parse as boolean
          else if (value.toLowerCase() === 'true') {
            value = true
          } else if (value.toLowerCase() === 'false') {
            value = false
          }

          obj[header] = value
        })

        result.push(obj)
      }

      setOutput(JSON.stringify(result, null, 2))
    } catch (e) {
      setError(`변환 실패: ${e instanceof Error ? e.message : '알 수 없는 오류'}`)
      setOutput('')
    }
  }

  const jsonToCSV = () => {
    try {
      setError('')
      if (!input.trim()) {
        setError('JSON 데이터를 입력해주세요.')
        return
      }

      const data = JSON.parse(input)

      if (!Array.isArray(data) || data.length === 0) {
        setError('JSON은 배열 형태여야 하며, 최소 1개의 객체가 있어야 합니다.')
        return
      }

      const headers = Object.keys(data[0])
      const csvLines = [headers.join(delimiter)]

      data.forEach(obj => {
        const values = headers.map(header => {
          const value = obj[header]
          // Escape values containing delimiter or newlines
          if (typeof value === 'string' && (value.includes(delimiter) || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        csvLines.push(values.join(delimiter))
      })

      setOutput(csvLines.join('\n'))
    } catch (e) {
      setError(`변환 실패: ${e instanceof Error ? e.message : '올바른 JSON 배열을 입력해주세요.'}`)
      setOutput('')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <ToolCard
      title="📊 CSV/JSON Converter"
      description="CSV와 JSON 형식을 상호 변환합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Delimiter
          </label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="\t">Tab (\t)</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>

        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          placeholder="CSV or JSON data..."
          label="Input"
          rows={10}
        />

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={csvToJSON}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            CSV → JSON
          </button>
          <button
            onClick={jsonToCSV}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            JSON → CSV
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          placeholder="변환된 결과가 여기에 표시됩니다..."
          readOnly
          label="Output"
          rows={10}
        />

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm space-y-2">
          <div className="font-medium text-gray-700 dark:text-gray-300">Example CSV:</div>
          <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
{`name,age,email
John,30,john@example.com
Jane,25,jane@example.com`}
          </pre>
        </div>
      </div>
    </ToolCard>
  )
}
