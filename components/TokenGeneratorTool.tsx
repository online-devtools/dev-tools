'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TokenGeneratorTool() {
  const { t } = useLanguage()
  // 길이, 문자 유형 선택, 생성 결과를 상태로 관리합니다.
  const [length, setLength] = useState('32')
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(false)
  const [output, setOutput] = useState('')

  const generateToken = () => {
    try {
      const len = parseInt(length, 10)
      if (isNaN(len) || len < 1 || len > 10000) {
        setOutput(t('token.error.length'))
        return
      }

      let chars = ''
      if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
      if (numbers) chars += '0123456789'
      if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

      if (chars.length === 0) {
        setOutput(t('token.error.noChars'))
        return
      }

      let token = ''
      const array = new Uint32Array(len)
      crypto.getRandomValues(array)

      for (let i = 0; i < len; i++) {
        token += chars[array[i] % chars.length]
      }

      setOutput(token)
    } catch {
      setOutput(t('token.error.generate'))
    }
  }

  return (
    <ToolCard
      title={`🎲 ${t('token.title')}`}
      description={t('token.description')}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('token.length.label')}
          </label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="1"
            max="10000"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('token.charTypes.label')}
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('token.charTypes.uppercase')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('token.charTypes.lowercase')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={numbers}
                onChange={(e) => setNumbers(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('token.charTypes.numbers')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={symbols}
                onChange={(e) => setSymbols(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('token.charTypes.symbols')}</span>
            </label>
          </div>
        </div>

        <button
          onClick={generateToken}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('token.actions.generate')}
        </button>

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('token.result.label')}
        />
      </div>
    </ToolCard>
  )
}
