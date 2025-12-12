'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TextBinaryTool() {
  const { t } = useLanguage()
  // 입력/출력/에러 상태를 관리해 텍스트와 바이너리를 상호 변환합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const textToBinary = () => {
    try {
      setError('')
      const binary = input
        .split('')
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ')
      setOutput(binary)
    } catch (err: any) {
      setError(t('textBinary.error.convert', { message: err.message }))
      setOutput('')
    }
  }

  const binaryToText = () => {
    try {
      setError('')
      const text = input
        .split(/\s+/)
        .map(bin => String.fromCharCode(parseInt(bin, 2)))
        .join('')
      setOutput(text)
    } catch (err: any) {
      setError(t('textBinary.error.convert', { message: err.message }))
      setOutput('')
    }
  }

  return (
    <ToolCard
      title={`0️⃣ ${t('textBinary.title')}`}
      description={t('textBinary.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('textBinary.input.label')}
          placeholder={t('textBinary.input.placeholder')}
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={textToBinary}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('textBinary.actions.textToBinary')}
          </button>
          <button
            onClick={binaryToText}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('textBinary.actions.binaryToText')}
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
          label={t('textBinary.output.label')}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{t('textBinary.examples.title')}</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• {t('textBinary.examples.a')}</li>
            <li>• {t('textBinary.examples.hello')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
