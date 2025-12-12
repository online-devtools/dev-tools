'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function StringObfuscatorTool() {
  const { t } = useLanguage()
  // 입력/출력과 마스킹 옵션을 상태로 관리해 번역된 메시지를 보여줍니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [visibleStart, setVisibleStart] = useState('4')
  const [visibleEnd, setVisibleEnd] = useState('4')
  const [maskChar, setMaskChar] = useState('*')

  const obfuscate = () => {
    try {
      if (!input) {
        setOutput('')
        return
      }

      const start = parseInt(visibleStart) || 0
      const end = parseInt(visibleEnd) || 0

      if (start + end >= input.length) {
        setOutput(input)
        return
      }

      const startPart = input.slice(0, start)
      const endPart = input.slice(-end || input.length)
      const middleLength = input.length - start - end
      const masked = maskChar.repeat(middleLength)

      setOutput(startPart + masked + endPart)
    } catch (error) {
      setOutput(t('stringObfuscator.error.generic'))
    }
  }

  return (
    <ToolCard
      title={`🎭 ${t('stringObfuscator.title')}`}
      description={t('stringObfuscator.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('stringObfuscator.input.label')}
          placeholder={t('stringObfuscator.input.placeholder')}
        />

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('stringObfuscator.visible.start')}
            </label>
            <input
              type="number"
              value={visibleStart}
              onChange={(e) => setVisibleStart(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('stringObfuscator.visible.end')}
            </label>
            <input
              type="number"
              value={visibleEnd}
              onChange={(e) => setVisibleEnd(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('stringObfuscator.maskChar')}
            </label>
            <input
              type="text"
              value={maskChar}
              onChange={(e) => setMaskChar(e.target.value.slice(0, 1) || '*')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              maxLength={1}
            />
          </div>
        </div>

        <button
          onClick={obfuscate}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('stringObfuscator.actions.obfuscate')}
        </button>

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('stringObfuscator.output.label')}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{t('stringObfuscator.examples.title')}</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• {t('stringObfuscator.examples.api')}</li>
            <li>• {t('stringObfuscator.examples.iban')}</li>
            <li>• {t('stringObfuscator.examples.email')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
