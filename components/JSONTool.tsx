'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import ToolSchemas from './ToolSchemas'

export default function JSONTool() {
  const { t } = useLanguage()
  // 입력 JSON과 결과/에러 상태를 관리해 번역된 메시지를 즉시 반영합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleFormat = () => {
    try {
      setError('')
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
    } catch (e) {
      setError(t('jsonTool.error.format', { message: e instanceof Error ? e.message : t('jsonTool.error.invalid') }))
      setOutput('')
    }
  }

  const handleMinify = () => {
    try {
      setError('')
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
    } catch (e) {
      setError(t('jsonTool.error.minify', { message: e instanceof Error ? e.message : t('jsonTool.error.invalid') }))
      setOutput('')
    }
  }

  const handleValidate = () => {
    try {
      setError('')
      JSON.parse(input)
      setOutput(t('jsonTool.validate.success'))
    } catch (e) {
      setError(t('jsonTool.validate.fail', { message: e instanceof Error ? e.message : '' }))
      setOutput('')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <>
    <ToolSchemas toolKey="json" toolPath="/json" categoryKey="category.dataFormat" categoryType="formatting" />
    <ToolCard
      title={`📋 ${t('jsonTool.title')}`}
      description={t('jsonTool.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          placeholder={t('jsonTool.input.placeholder')}
          label={t('jsonTool.input.label')}
          rows={8}
        />

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleFormat}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('jsonTool.actions.format')}
          </button>
          <button
            onClick={handleMinify}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('jsonTool.actions.minify')}
          </button>
          <button
            onClick={handleValidate}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('jsonTool.actions.validate')}
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('jsonTool.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          placeholder={t('jsonTool.result.placeholder')}
          readOnly
          label={t('jsonTool.result.label')}
          rows={8}
        />
      </div>
    </ToolCard>
    </>
  )
}
