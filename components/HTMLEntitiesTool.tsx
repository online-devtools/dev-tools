'use client'

import { useState } from 'react'
import he from 'he'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function HTMLEntitiesTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const encode = () => {
    setOutput(he.encode(input, { useNamedReferences: true }))
  }

  const decode = () => {
    setOutput(he.decode(input))
  }

  return (
    <ToolCard
      title="HTML Entities Encoder/Decoder"
      description="HTML 특수문자를 엔티티로 변환합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label="입력"
          placeholder="<div>Hello & World</div>"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={encode}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Encode (인코딩)
          </button>
          <button
            onClick={decode}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Decode (디코딩)
          </button>
        </div>

        <TextAreaWithCopy
          value={output}
          readOnly
          label="출력"
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">주요 HTML 엔티티</h3>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <div>&lt; = &amp;lt;</div>
            <div>&gt; = &amp;gt;</div>
            <div>&amp; = &amp;amp;</div>
            <div>" = &amp;quot;</div>
            <div>' = &amp;#39;</div>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
