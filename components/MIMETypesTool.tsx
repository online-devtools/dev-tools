'use client'

import { useState } from 'react'
import mime from 'mime-types'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'

// 미리보기 섹션에 사용할 공통 MIME 타입 목록을 정의합니다.
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

export default function MIMETypesTool() {
  const { t } = useLanguage()
  // 사용자가 입력한 값을 받아 변환 결과를 보여주는 상태입니다.
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  // 입력이 MIME 타입인지 확장자인지 판별해 알맞은 방향으로 변환합니다.
  const lookup = () => {
    if (!input) {
      setResult('')
      return
    }

    if (input.includes('/')) {
      // 슬래시를 포함하면 MIME 타입이므로 확장자를 조회합니다.
      const ext = mime.extension(input)
      setResult(ext ? `.${ext}` : t('mime.error.noExtension'))
    } else {
      // 확장자로 간주하며, 앞에 점이 없으면 붙여서 조회합니다.
      const cleanExt = input.startsWith('.') ? input : `.${input}`
      const mimeType = mime.lookup(cleanExt)
      setResult(mimeType || t('mime.error.noMime'))
    }
  }

  return (
    <ToolCard
      title={`🗂️ ${t('mime.title')}`}
      description={t('mime.description')}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('mime.input.label')}
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && lookup()}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder={t('mime.input.placeholder')}
          />
        </div>

        <button
          onClick={lookup}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('mime.action.convert')}
        </button>

        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('mime.result.label')}
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {result}
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            {t('mime.common.title')}
          </h3>
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {commonTypes.map(({ ext, mime: mimeType }) => (
              <div key={ext} className="flex justify-between">
                <span className="font-mono">{ext}</span>
                <span className="text-gray-600 dark:text-gray-400">{mimeType}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
