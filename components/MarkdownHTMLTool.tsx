'use client'

import { useState } from 'react'
import { marked } from 'marked'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function MarkdownHTMLTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const convert = () => {
    try {
      const html = marked.parse(input) as string
      setOutput(html)
    } catch (error: any) {
      setOutput(`변환 오류: ${error.message}`)
    }
  }

  return (
    <ToolCard
      title="Markdown to HTML"
      description="Markdown을 HTML로 변환합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={(value) => {
            setInput(value)
            if (value) {
              const html = marked.parse(value) as string
              setOutput(html)
            } else {
              setOutput('')
            }
          }}
          label="Markdown 입력"
          placeholder="# 제목\n\n## 부제목\n\n- 리스트 1\n- 리스트 2\n\n**굵은 텍스트**"
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showPreview"
            checked={showPreview}
            onChange={(e) => setShowPreview(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="showPreview" className="text-sm text-gray-700 dark:text-gray-300">
            미리보기 표시
          </label>
        </div>

        {showPreview && output && (
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">미리보기</h3>
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          readOnly
          label="HTML 출력"
        />
      </div>
    </ToolCard>
  )
}
