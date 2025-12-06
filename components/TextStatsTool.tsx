'use client'

import { useState, useEffect } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function TextStatsTool() {
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
    <ToolCard
      title="Text Statistics"
      description="텍스트의 다양한 통계 정보를 분석합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label="텍스트 입력"
          placeholder="분석할 텍스트를 입력하세요..."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.characters.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">총 문자 수</div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.charactersNoSpaces.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">공백 제외 문자</div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.words.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">단어 수</div>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.lines.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">줄 수</div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.sentences.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">문장 수</div>
          </div>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.paragraphs.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">단락 수</div>
          </div>

          <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.bytes.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">바이트</div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.words > 0 ? Math.ceil(stats.words / 200) : 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">예상 읽기 시간 (분)</div>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
