'use client'

import { useState } from 'react'
import mime from 'mime-types'
import ToolCard from './ToolCard'

export default function MIMETypesTool() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  const lookup = () => {
    if (!input) {
      setResult('')
      return
    }

    // Check if input is a file extension or MIME type
    if (input.includes('/')) {
      // It's a MIME type, get extension
      const ext = mime.extension(input)
      setResult(ext ? `.${ext}` : '확장자를 찾을 수 없습니다')
    } else {
      // It's an extension, get MIME type
      const cleanExt = input.startsWith('.') ? input : `.${input}`
      const mimeType = mime.lookup(cleanExt)
      setResult(mimeType || 'MIME 타입을 찾을 수 없습니다')
    }
  }

  const commonTypes = [
    { ext: '.html', mime: 'text/html' },
    { ext: '.css', mime: 'text/css' },
    { ext: '.js', mime: 'application/javascript' },
    { ext: '.json', mime: 'application/json' },
    { ext: '.png', mime: 'image/png' },
    { ext: '.jpg', mime: 'image/jpeg' },
    { ext: '.gif', mime: 'image/gif' },
    { ext: '.svg', mime: 'image/svg+xml' },
    { ext: '.pdf', mime: 'application/pdf' },
    { ext: '.zip', mime: 'application/zip' },
    { ext: '.mp4', mime: 'video/mp4' },
    { ext: '.mp3', mime: 'audio/mpeg' },
  ]

  return (
    <ToolCard
      title="MIME Types"
      description="MIME 타입과 파일 확장자를 상호 변환합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            파일 확장자 또는 MIME 타입 입력
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && lookup()}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder=".jpg 또는 image/jpeg"
          />
        </div>

        <button
          onClick={lookup}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          변환
        </button>

        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">결과</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {result}
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">주요 MIME 타입</h3>
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {commonTypes.map(({ ext, mime }) => (
              <div key={ext} className="flex justify-between">
                <span className="font-mono">{ext}</span>
                <span className="text-gray-600 dark:text-gray-400">{mime}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
