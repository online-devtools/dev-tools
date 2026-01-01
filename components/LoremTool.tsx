'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import ToolSchemas from './ToolSchemas'

export default function LoremTool() {
  const [paragraphs, setParagraphs] = useState(3)
  const [words, setWords] = useState(50)
  const [type, setType] = useState<'paragraphs' | 'words' | 'sentences'>('paragraphs')
  const [output, setOutput] = useState('')

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ]

  const generateWords = (count: number) => {
    const result = []
    for (let i = 0; i < count; i++) {
      result.push(loremWords[Math.floor(Math.random() * loremWords.length)])
    }
    return result.join(' ')
  }

  const generateSentence = () => {
    const wordCount = Math.floor(Math.random() * 10) + 5
    const sentence = generateWords(wordCount)
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
  }

  const generateParagraph = () => {
    const sentenceCount = Math.floor(Math.random() * 5) + 3
    const sentences = []
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence())
    }
    return sentences.join(' ')
  }

  const handleGenerate = () => {
    let result = ''

    if (type === 'paragraphs') {
      const paras = []
      for (let i = 0; i < paragraphs; i++) {
        paras.push(generateParagraph())
      }
      result = paras.join('\n\n')
    } else if (type === 'words') {
      result = generateWords(words)
    } else if (type === 'sentences') {
      const sentences = []
      for (let i = 0; i < paragraphs; i++) {
        sentences.push(generateSentence())
      }
      result = sentences.join(' ')
    }

    setOutput(result)
  }

  return (
    <>
    <ToolSchemas toolKey="lorem" toolPath="/lorem" categoryKey="category.generators" categoryType="generator" />
    <ToolCard
      title="📄 Lorem Ipsum Generator"
      description="더미 텍스트를 생성합니다"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            생성 타입
          </label>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setType('paragraphs')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                type === 'paragraphs'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Paragraphs
            </button>
            <button
              onClick={() => setType('sentences')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                type === 'sentences'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Sentences
            </button>
            <button
              onClick={() => setType('words')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                type === 'words'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Words
            </button>
          </div>
        </div>

        {(type === 'paragraphs' || type === 'sentences') && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {type === 'paragraphs' ? '문단 개수' : '문장 개수'}: {paragraphs}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={paragraphs}
              onChange={(e) => setParagraphs(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        )}

        {type === 'words' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              단어 개수: {words}
            </label>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={words}
              onChange={(e) => setWords(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>10</span>
              <span>500</span>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          Generate
        </button>

        {output && (
          <TextAreaWithCopy
            value={output}
            placeholder="결과가 여기에 표시됩니다..."
            readOnly
            label="생성된 텍스트"
            rows={12}
          />
        )}
      </div>
    </ToolCard>
    </>
  )
}
