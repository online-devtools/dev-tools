'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function ListConverterTool() {
  const [input, setInput] = useState('')
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [separator, setSeparator] = useState('\\n')

  const transform = (operation: string) => {
    let items = input.split('\n').filter(item => item.trim())

    switch (operation) {
      case 'sort-asc':
        items = items.sort()
        break
      case 'sort-desc':
        items = items.sort().reverse()
        break
      case 'unique':
        items = [...new Set(items)]
        break
      case 'reverse':
        items = items.reverse()
        break
      case 'lowercase':
        items = items.map(item => item.toLowerCase())
        break
      case 'uppercase':
        items = items.map(item => item.toUpperCase())
        break
      case 'trim':
        items = items.map(item => item.trim())
        break
    }

    // Apply prefix/suffix
    if (prefix || suffix) {
      items = items.map(item => `${prefix}${item}${suffix}`)
    }

    // Apply separator
    const sep = separator.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
    return items.join(sep)
  }

  const [output, setOutput] = useState('')

  return (
    <ToolCard
      title="List Converter"
      description="리스트 데이터를 다양하게 변환합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label="리스트 입력 (한 줄에 하나씩)"
          placeholder="apple&#10;banana&#10;cherry&#10;apple"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              접두사
            </label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="• "
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              접미사
            </label>
            <input
              type="text"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder=","
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            구분자 (\n = 줄바꿈, \t = 탭)
          </label>
          <input
            type="text"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
            placeholder="\n"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => setOutput(transform('sort-asc'))}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            오름차순 정렬
          </button>
          <button
            onClick={() => setOutput(transform('sort-desc'))}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            내림차순 정렬
          </button>
          <button
            onClick={() => setOutput(transform('unique'))}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            중복 제거
          </button>
          <button
            onClick={() => setOutput(transform('reverse'))}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            역순
          </button>
          <button
            onClick={() => setOutput(transform('lowercase'))}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            소문자
          </button>
          <button
            onClick={() => setOutput(transform('uppercase'))}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            대문자
          </button>
          <button
            onClick={() => setOutput(transform('trim'))}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            공백 제거
          </button>
          <button
            onClick={() => setOutput(input.split('\n').filter(item => item.trim()).join(separator.replace(/\\n/g, '\n').replace(/\\t/g, '\t')))}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            빈 줄 제거
          </button>
        </div>

        <TextAreaWithCopy
          value={output}
          readOnly
          label="변환된 리스트"
        />
      </div>
    </ToolCard>
  )
}
