'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function JSONCSVTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const jsonToCSV = () => {
    try {
      setError('')
      const data = JSON.parse(input)

      if (!Array.isArray(data)) {
        setError('JSON 배열을 입력해주세요.')
        setOutput('')
        return
      }

      if (data.length === 0) {
        setError('빈 배열입니다.')
        setOutput('')
        return
      }

      // Get headers from first object
      const headers = Object.keys(data[0])
      const csvRows = []

      // Add header row
      csvRows.push(headers.join(','))

      // Add data rows
      for (const row of data) {
        const values = headers.map(header => {
          const value = row[header]
          // Escape quotes and wrap in quotes if contains comma or quote
          const escaped = String(value).replace(/"/g, '""')
          return escaped.includes(',') || escaped.includes('"') ? `"${escaped}"` : escaped
        })
        csvRows.push(values.join(','))
      }

      setOutput(csvRows.join('\n'))
    } catch (err: any) {
      setError(`변환 오류: ${err.message}`)
      setOutput('')
    }
  }

  return (
    <ToolCard
      title="JSON to CSV"
      description="JSON 배열을 CSV 형식으로 변환합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label="JSON 배열 입력"
          placeholder='[{"name":"John","age":30},{"name":"Jane","age":25}]'
        />

        <button
          onClick={jsonToCSV}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          JSON → CSV 변환
        </button>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          readOnly
          label="CSV 출력"
        />
      </div>
    </ToolCard>
  )
}
