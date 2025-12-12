'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function JSONMinifyTool() {
  const { t } = useLanguage()
  // JSON 입력/출력 및 에러 상태를 관리합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const minify = () => {
    try {
      setError('')
      const obj = JSON.parse(input)
      setOutput(JSON.stringify(obj))
    } catch (err: any) {
      setError(t('jsonMinify.error', { message: err.message }))
      setOutput('')
    }
  }

  const prettify = () => {
    try {
      setError('')
      const obj = JSON.parse(input)
      setOutput(JSON.stringify(obj, null, 2))
    } catch (err: any) {
      setError(t('jsonMinify.error', { message: err.message }))
      setOutput('')
    }
  }

  return (
    <ToolCard
      title={`📦 ${t('jsonMinify.title')}`}
      description={t('jsonMinify.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('jsonMinify.input.label')}
          placeholder='{"name": "John", "age": 30}'
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={minify}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('jsonMinify.actions.minify')}
          </button>
          <button
            onClick={prettify}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('jsonMinify.actions.prettify')}
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
          label={t('jsonMinify.output.label')}
        />

        {output && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('jsonMinify.compression', {
              ratio: input.length > 0 ? ((1 - output.length / input.length) * 100).toFixed(1) : 0,
              before: input.length,
              after: output.length,
            })}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
