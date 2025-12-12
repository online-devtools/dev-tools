'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DiffTool() {
  const { t } = useLanguage()
  // 두 텍스트와 diff 결과를 상태로 관리해 비교 결과를 표시합니다.
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [diff, setDiff] = useState<{ line: number; type: string; content: string }[]>([])

  const handleCompare = () => {
    const lines1 = text1.split('\n')
    const lines2 = text2.split('\n')
    const maxLength = Math.max(lines1.length, lines2.length)
    const result: { line: number; type: string; content: string }[] = []

    for (let i = 0; i < maxLength; i++) {
      const line1 = lines1[i] || ''
      const line2 = lines2[i] || ''

      if (line1 === line2) {
        result.push({ line: i + 1, type: 'same', content: line1 })
      } else {
        if (line1) {
          result.push({ line: i + 1, type: 'removed', content: line1 })
        }
        if (line2) {
          result.push({ line: i + 1, type: 'added', content: line2 })
        }
      }
    }

    setDiff(result)
  }

  const handleClear = () => {
    setText1('')
    setText2('')
    setDiff([])
  }

  return (
    <ToolCard
      title={`📊 ${t('diffTool.title')}`}
      description={t('diffTool.description')}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('diffTool.input.original.label')}
            </label>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder={t('diffTool.input.original.placeholder')}
              rows={10}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('diffTool.input.compare.label')}
            </label>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder={t('diffTool.input.compare.placeholder')}
              rows={10}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleCompare}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('diffTool.actions.compare')}
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('diffTool.actions.clear')}
          </button>
        </div>

        {diff.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('diffTool.result.label')}
            </label>
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4 max-h-96 overflow-y-auto">
              {diff.map((item, index) => (
                <div
                  key={index}
                  className={`font-mono text-sm py-1 px-2 ${
                    item.type === 'added'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : item.type === 'removed'
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="inline-block w-8 text-gray-500 dark:text-gray-400">{item.line}</span>
                  <span className="inline-block w-8">
                    {item.type === 'added' ? '+' : item.type === 'removed' ? '-' : ' '}
                  </span>
                  {item.content}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
