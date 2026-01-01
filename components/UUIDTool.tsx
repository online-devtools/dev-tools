'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import ToolSchemas from './ToolSchemas'

export default function UUIDTool() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const handleGenerate = () => {
    const newUuids = Array.from({ length: count }, () => generateUUID())
    setUuids(newUuids)
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'))
  }

  return (
    <>
    <ToolSchemas toolKey="uuid" toolPath="/uuid" categoryKey="category.generators" categoryType="generator" />
    <ToolCard
      title="🆔 UUID Generator"
      description="UUID (Universally Unique Identifier)를 생성합니다"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              생성 개수
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="pt-6">
            <button
              onClick={handleGenerate}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Generate
            </button>
          </div>
        </div>

        {uuids.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                생성된 UUID ({uuids.length}개)
              </label>
              <button
                onClick={copyAll}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition-colors"
              >
                Copy All
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  <code className="font-mono text-sm text-gray-800 dark:text-gray-200">
                    {uuid}
                  </code>
                  <button
                    onClick={() => copyToClipboard(uuid)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolCard>
    </>
  )
}
