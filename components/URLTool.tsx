'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function URLTool() {
  const { t } = useLanguage()
  // 입력/출력/에러 상태를 관리해 URL 인코딩/디코딩 결과를 표시합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleEncode = () => {
    try {
      setError('')
      const encoded = encodeURIComponent(input)
      setOutput(encoded)
    } catch (e) {
      setError(t('urlTool.error.encode'))
      setOutput('')
    }
  }

  const handleDecode = () => {
    try {
      setError('')
      const decoded = decodeURIComponent(input)
      setOutput(decoded)
    } catch (e) {
      setError(t('urlTool.error.decode'))
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
      title={`🔗 ${t('urlTool.title')}`}
      description={t('urlTool.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          placeholder={t('urlTool.input.placeholder')}
          label={t('urlTool.input.label')}
          rows={4}
        />

        <div className="flex gap-3 flex-wrap">
          <button
          onClick={handleEncode}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          {t('urlTool.actions.encode')}
        </button>
        <button
          onClick={handleDecode}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
        >
          {t('urlTool.actions.decode')}
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          {t('urlTool.actions.clear')}
        </button>
      </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          placeholder={t('urlTool.output.placeholder')}
          readOnly
          label={t('urlTool.output.label')}
          rows={4}
        />
      </div>
    </ToolCard>
  )
}
