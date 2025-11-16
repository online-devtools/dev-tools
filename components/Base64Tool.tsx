'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { decodeBase64, encodeBase64 } from '@/utils/encoding'

export default function Base64Tool() {
  const { t } = useLanguage()
  // Local component state mirrors the controlled textareas and which error message to show.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [errorKey, setErrorKey] = useState<string | null>(null)

  // Use shared helpers so the logic matches the unit tests and can run in Node/browser.
  const handleEncode = () => {
    try {
      setErrorKey(null)
      setOutput(encodeBase64(input))
    } catch {
      setErrorKey('base64.error.encode')
      setOutput('')
    }
  }

  const handleDecode = () => {
    try {
      setErrorKey(null)
      setOutput(decodeBase64(input))
    } catch {
      setErrorKey('base64.error.decode')
      setOutput('')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setErrorKey(null)
  }

  return (
    <ToolCard
      title={`🔤 ${t('base64.title')}`}
      description={t('base64.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          placeholder={t('base64.input.placeholder')}
          label={t('base64.input.label')}
        />

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleEncode}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('base64.actions.encode')}
          </button>
          <button
            onClick={handleDecode}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('base64.actions.decode')}
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('base64.actions.clear')}
          </button>
        </div>

        {errorKey && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {t(errorKey)}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          placeholder={t('base64.output.placeholder')}
          readOnly
          label={t('base64.output.label')}
        />
      </div>
    </ToolCard>
  )
}
