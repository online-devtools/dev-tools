'use client'

import { useState } from 'react'
import slugify from 'slugify'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function SlugifyTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [lowercase, setLowercase] = useState(true)
  const [strict, setStrict] = useState(false)

  const convertToSlug = () => {
    try {
      if (!input) {
        setOutput('')
        return
      }

      const slug = slugify(input, {
        lower: lowercase,
        strict: strict,
        replacement: '-',
      })

      setOutput(slug)
    } catch (error) {
      setOutput('변환 중 오류가 발생했습니다.')
    }
  }

  return (
    <ToolCard
      title="Slugify String"
      description="문자열을 URL/파일명으로 사용 가능하도록 변환합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={(value) => {
            setInput(value)
            // Auto-convert on input
            if (value) {
              const slug = slugify(value, {
                lower: lowercase,
                strict: strict,
                replacement: '-',
              })
              setOutput(slug)
            } else {
              setOutput('')
            }
          }}
          label="입력 문자열"
          placeholder="Hello World! 안녕하세요 123"
        />

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => {
                setLowercase(e.target.checked)
                if (input) convertToSlug()
              }}
              className="rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">소문자로 변환</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={strict}
              onChange={(e) => {
                setStrict(e.target.checked)
                if (input) convertToSlug()
              }}
              className="rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Strict 모드 (영문자, 숫자, 하이픈만 허용)
            </span>
          </label>
        </div>

        <TextAreaWithCopy
          value={output}
          readOnly
          label="변환된 Slug"
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">예시</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• "Hello World!" → "hello-world"</li>
            <li>• "안녕하세요 123" → "annyeonghaseyo-123"</li>
            <li>• "C++ Programming" → "c-programming"</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
