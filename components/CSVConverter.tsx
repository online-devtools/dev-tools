'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CSVConverter() {
  const { t } = useLanguage()
  // 입력, 출력, 구분자, 에러 상태를 관리해 양방향 변환 시 번역된 메시지를 표시합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [delimiter, setDelimiter] = useState(',')

  const csvToJSON = () => {
    try {
      setError('')
      if (!input.trim()) {
        setError(t('csvTool.error.csvRequired'))
        return
      }

      const lines = input.trim().split('\n')
      if (lines.length < 2) {
        setError(t('csvTool.error.minRows'))
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
      setError(t('csvTool.error.csvConvert', { message: e instanceof Error ? e.message : t('csvTool.error.jsonConvert') }))
      setOutput('')
    }
  }

  const jsonToCSV = () => {
    try {
      setError('')
      if (!input.trim()) {
        setError(t('csvTool.error.jsonRequired'))
        return
      }

      const data = JSON.parse(input)

      if (!Array.isArray(data) || data.length === 0) {
        setError(t('csvTool.error.jsonArray'))
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
      setError(t('csvTool.error.jsonConvert', { message: e instanceof Error ? e.message : t('csvTool.error.invalidJson') }))
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
      title={`📊 ${t('csvTool.title')}`}
      description={t('csvTool.description')}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('csvTool.delimiter.label')}
          </label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value=",">{t('csvTool.delimiter.comma')}</option>
            <option value=";">{t('csvTool.delimiter.semicolon')}</option>
            <option value="\t">{t('csvTool.delimiter.tab')}</option>
            <option value="|">{t('csvTool.delimiter.pipe')}</option>
          </select>
        </div>

        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          placeholder={t('csvTool.input.placeholder')}
          label={t('csvTool.input.label')}
          rows={10}
        />

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={csvToJSON}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('csvTool.actions.csvToJson')}
          </button>
          <button
            onClick={jsonToCSV}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('csvTool.actions.jsonToCsv')}
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('csvTool.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          placeholder={t('csvTool.result.placeholder')}
          readOnly
          label={t('csvTool.result.label')}
          rows={10}
        />

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm space-y-2">
          <div className="font-medium text-gray-700 dark:text-gray-300">{t('csvTool.example.label')}</div>
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
