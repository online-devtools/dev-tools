'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import CryptoJS from 'crypto-js'
import ToolSchemas from './ToolSchemas'

export default function HashTool() {
  const [input, setInput] = useState('')
  const [md5, setMd5] = useState('')
  const [sha1, setSha1] = useState('')
  const [sha256, setSha256] = useState('')
  const [sha512, setSha512] = useState('')

  const handleGenerate = () => {
    if (!input) {
      setMd5('')
      setSha1('')
      setSha256('')
      setSha512('')
      return
    }

    setMd5(CryptoJS.MD5(input).toString())
    setSha1(CryptoJS.SHA1(input).toString())
    setSha256(CryptoJS.SHA256(input).toString())
    setSha512(CryptoJS.SHA512(input).toString())
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  const handleClear = () => {
    setInput('')
    setMd5('')
    setSha1('')
    setSha256('')
    setSha512('')
  }

  return (
    <>
    <ToolSchemas toolKey="hash" toolPath="/hash" categoryKey="category.security" categoryType="security" />
    <ToolCard
      title="🔒 Hash Generator"
      description="MD5, SHA-1, SHA-256, SHA-512 해시를 생성합니다"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            입력 텍스트
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="해시를 생성할 텍스트를 입력하세요..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Generate Hashes
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Clear
          </button>
        </div>

        {(md5 || sha1 || sha256 || sha512) && (
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">MD5</span>
                <button
                  onClick={() => copyToClipboard(md5)}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
                >
                  Copy
                </button>
              </div>
              <code className="block font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
                {md5}
              </code>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SHA-1</span>
                <button
                  onClick={() => copyToClipboard(sha1)}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
                >
                  Copy
                </button>
              </div>
              <code className="block font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
                {sha1}
              </code>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SHA-256</span>
                <button
                  onClick={() => copyToClipboard(sha256)}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
                >
                  Copy
                </button>
              </div>
              <code className="block font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
                {sha256}
              </code>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SHA-512</span>
                <button
                  onClick={() => copyToClipboard(sha512)}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
                >
                  Copy
                </button>
              </div>
              <code className="block font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
                {sha512}
              </code>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
    </>
  )
}
