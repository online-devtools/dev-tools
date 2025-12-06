'use client'

import { useState, useEffect } from 'react'
import ToolCard from './ToolCard'

export default function KeycodeTool() {
  const [keyInfo, setKeyInfo] = useState<{
    key: string
    code: string
    keyCode: number
    which: number
    location: number
    altKey: boolean
    ctrlKey: boolean
    shiftKey: boolean
    metaKey: boolean
  } | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      setKeyInfo({
        key: e.key,
        code: e.code,
        keyCode: e.keyCode,
        which: e.which,
        location: e.location,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <ToolCard
      title="Keycode Info"
      description="키보드 키를 눌러 정보를 확인하세요"
    >
      <div className="space-y-4">
        {!keyInfo ? (
          <div className="p-8 text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-6xl mb-4">⌨️</div>
            <div className="text-lg font-medium text-gray-800 dark:text-white">
              아무 키나 눌러보세요
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              키보드의 모든 정보가 표시됩니다
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg text-center">
              <div className="text-7xl font-bold text-gray-900 dark:text-white mb-2">
                {keyInfo.key.length === 1 ? keyInfo.key : keyInfo.code}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {keyInfo.key}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="text-sm text-gray-600 dark:text-gray-400">key</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {keyInfo.key}
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="text-sm text-gray-600 dark:text-gray-400">code</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {keyInfo.code}
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="text-sm text-gray-600 dark:text-gray-400">keyCode</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {keyInfo.keyCode}
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="text-sm text-gray-600 dark:text-gray-400">which</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {keyInfo.which}
                </div>
              </div>
            </div>

            {(keyInfo.altKey || keyInfo.ctrlKey || keyInfo.shiftKey || keyInfo.metaKey) && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="font-semibold text-gray-800 dark:text-white mb-2">수정 키</div>
                <div className="flex flex-wrap gap-2">
                  {keyInfo.altKey && <span className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 rounded text-sm">Alt</span>}
                  {keyInfo.ctrlKey && <span className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 rounded text-sm">Ctrl</span>}
                  {keyInfo.shiftKey && <span className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 rounded text-sm">Shift</span>}
                  {keyInfo.metaKey && <span className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 rounded text-sm">Meta</span>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolCard>
  )
}
