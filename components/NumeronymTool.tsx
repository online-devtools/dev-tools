'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'

export default function NumeronymTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const generateNumeronym = (word: string): string => {
    if (word.length <= 3) return word
    const first = word[0]
    const last = word[word.length - 1]
    const middle = word.length - 2
    return `${first}${middle}${last}`
  }

  const convert = (text: string) => {
    const words = text.split(/\s+/)
    const numeronyms = words.map(word => generateNumeronym(word))
    setOutput(numeronyms.join(' '))
  }

  return (
    <ToolCard
      title="Numeronym Generator"
      description="단어를 numeronym(수자어)으로 변환합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            입력 단어
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              convert(e.target.value)
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="internationalization accessibility kubernetes"
          />
        </div>

        {output && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Numeronym</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {output}
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">유명한 Numeronym</h3>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <div>• internationalization → <strong>i18n</strong></div>
            <div>• localization → <strong>l10n</strong></div>
            <div>• accessibility → <strong>a11y</strong></div>
            <div>• kubernetes → <strong>k8s</strong></div>
            <div>• observability → <strong>o11y</strong></div>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
