'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TextUnicodeTool() {
  const { t } = useLanguage()
  // 텍스트/유니코드 상호 변환을 위한 입력/출력/에러/포맷 상태를 관리합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [format, setFormat] = useState<'U+' | '\\u' | '&#'>('U+')

  const textToUnicode = () => {
    try {
      setError('')
      const unicode = Array.from(input)
        .map(char => {
          const code = char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')
          if (format === 'U+') return `U+${code}`
          if (format === '\\u') return `\\u${code}`
          return `&#x${code};`
        })
        .join(' ')
      setOutput(unicode)
    } catch (err: any) {
      setError(t('textUnicode.error.convert', { message: err.message }))
      setOutput('')
    }
  }

  const unicodeToText = () => {
    try {
      setError('')
      const text = input
        .replace(/U\+|\\u|&#x|;/g, ' ')
        .trim()
        .split(/\s+/)
        .map(code => String.fromCodePoint(parseInt(code, 16)))
        .join('')
      setOutput(text)
    } catch (err: any) {
      setError(t('textUnicode.error.convert', { message: err.message }))
      setOutput('')
    }
  }

  return (
    <ToolCard
      title={`🔣 ${t('textUnicode.title')}`}
      description={t('textUnicode.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('textUnicode.input.label')}
          placeholder={t('textUnicode.input.placeholder')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('textUnicode.format.label')}
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'U+' | '\\u' | '&#')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="U+">U+ (e.g., U+0048)</option>
            <option value="\u">\u (e.g., \u0048)</option>
            <option value="&#">HTML (e.g., &#x0048;)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
          onClick={textToUnicode}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('textUnicode.actions.textToUnicode')}
        </button>
        <button
          onClick={unicodeToText}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('textUnicode.actions.unicodeToText')}
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
          label={t('textUnicode.output.label')}
        />
      </div>
    </ToolCard>
  )
}
