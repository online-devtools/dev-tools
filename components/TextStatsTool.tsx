'use client'

import { useState, useEffect } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import ToolSchemas from './ToolSchemas'

export default function TextStatsTool() {
  const { t } = useLanguage()
  // 입력 텍스트와 통계 결과를 상태로 관리해 실시간으로 번역된 통계를 보여줍니다.
  const [input, setInput] = useState('')
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    sentences: 0,
    paragraphs: 0,
    bytes: 0,
  })

  useEffect(() => {
    const characters = input.length
    const charactersNoSpaces = input.replace(/\s/g, '').length
    const words = input.trim() ? input.trim().split(/\s+/).length : 0
    const lines = input ? input.split('\n').length : 0
    const sentences = input ? (input.match(/[.!?]+/g) || []).length : 0
    const paragraphs = input.trim() ? input.split(/\n\s*\n/).filter(p => p.trim()).length : 0
    const bytes = new TextEncoder().encode(input).length

    setStats({
      characters,
      charactersNoSpaces,
      words,
      lines,
      sentences,
      paragraphs,
      bytes,
    })
  }, [input])

  return (
    <>
    <ToolSchemas toolKey="text-stats" toolPath="/text-stats" categoryKey="category.text" categoryType="formatting" />
    <ToolCard
      title={`📊 ${t('textStats.title')}`}
      description={t('textStats.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('textStats.input.label')}
          placeholder={t('textStats.input.placeholder')}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.characters.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('textStats.stats.characters')}</div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.charactersNoSpaces.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('textStats.stats.charactersNoSpaces')}</div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.words.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('textStats.stats.words')}</div>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.lines.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('textStats.stats.lines')}</div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.sentences.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('textStats.stats.sentences')}</div>
          </div>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.paragraphs.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('textStats.stats.paragraphs')}</div>
          </div>

          <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.bytes.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('textStats.stats.bytes')}</div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.words > 0 ? Math.ceil(stats.words / 200) : 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('textStats.stats.readTime')}</div>
          </div>
        </div>
      </div>
    </ToolCard>
    </>
  )
}
