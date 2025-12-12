'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HTMLTool() {
  const { t } = useLanguage()
  // 입력, 결과, 에러 메시지를 상태로 관리해 다국어 UI를 유지합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  // 단순한 포매터: 태그 사이에 줄바꿈과 들여쓰기를 추가합니다.
  const formatHTML = (html: string) => {
    let formatted = ''
    let indent = 0
    const tab = '  '

    html.split(/>\s*</).forEach((node) => {
      if (node.match(/^\/\w/)) indent--
      formatted += `${tab.repeat(Math.max(0, indent))}<${node}>\n`
      if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith('input')) indent++
    })

    return formatted.substring(1, formatted.length - 2)
  }

  // 미니파이: 공백을 축소하고 태그 사이의 개행을 제거합니다.
  const minifyHTML = (html: string) => {
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim()
  }

  const handleFormat = () => {
    try {
      setError('')
      if (!input.trim()) {
        setError(t('htmlTool.error.required'))
        return
      }
      const formatted = formatHTML(input)
      setOutput(formatted)
    } catch (e) {
      setError(t('htmlTool.error.format', { message: e instanceof Error ? e.message : t('htmlTool.error.unknown') }))
      setOutput('')
    }
  }

  const handleMinify = () => {
    try {
      setError('')
      if (!input.trim()) {
        setError(t('htmlTool.error.required'))
        return
      }
      const minified = minifyHTML(input)
      setOutput(minified)
    } catch (e) {
      setError(t('htmlTool.error.minify', { message: e instanceof Error ? e.message : t('htmlTool.error.unknown') }))
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
      title={`🏷️ ${t('htmlTool.title')}`}
      description={t('htmlTool.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          placeholder={t('htmlTool.input.placeholder')}
          label={t('htmlTool.input.label')}
          rows={10}
        />

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleFormat}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('htmlTool.actions.format')}
          </button>
          <button
            onClick={handleMinify}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('htmlTool.actions.minify')}
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('htmlTool.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          placeholder={t('htmlTool.result.placeholder')}
          readOnly
          label={t('htmlTool.result.label')}
          rows={10}
        />
      </div>
    </ToolCard>
  )
}
