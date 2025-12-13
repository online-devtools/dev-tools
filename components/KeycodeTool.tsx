'use client'

import { useState, useEffect } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'

export default function KeycodeTool() {
  const { t } = useLanguage()
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
      // Don't prevent default for certain important keys
      // Allow Ctrl+K, Ctrl+R, F5, etc.
      const allowedKeys = ['k', 'r', 'F5', 'F12']
      const isAllowedShortcut = (e.ctrlKey || e.metaKey) && allowedKeys.includes(e.key)
      const isFunctionKey = e.key.startsWith('F') && !isNaN(parseInt(e.key.substring(1)))

      if (!isAllowedShortcut && !isFunctionKey) {
        e.preventDefault()
      }

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
      title={t('keycode.title')}
      description={t('keycode.description')}
    >
      <div className="space-y-4">
        {!keyInfo ? (
          <div className="p-8 text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="text-6xl mb-4">⌨️</div>
            <div className="text-lg font-medium text-gray-800 dark:text-white">
              {t('keycode.prompt')}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {t('keycode.info')}
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800 text-center">
              <div className="text-7xl font-bold text-gray-900 dark:text-white mb-2 break-all">
                {keyInfo.key.length === 1 ? keyInfo.key : keyInfo.code}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {keyInfo.key}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">key</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white break-all">
                  {keyInfo.key}
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">code</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white break-all">
                  {keyInfo.code}
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">keyCode</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {keyInfo.keyCode}
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">which</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {keyInfo.which}
                </div>
              </div>
            </div>

            {(keyInfo.altKey || keyInfo.ctrlKey || keyInfo.shiftKey || keyInfo.metaKey) && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="font-semibold text-gray-800 dark:text-white mb-2">
                  {t('keycode.modifiers')}
                </div>
                <div className="flex flex-wrap gap-2">
                  {keyInfo.altKey && <span className="px-3 py-1 bg-yellow-200 dark:bg-yellow-700 text-gray-800 dark:text-white rounded font-medium text-sm">Alt</span>}
                  {keyInfo.ctrlKey && <span className="px-3 py-1 bg-yellow-200 dark:bg-yellow-700 text-gray-800 dark:text-white rounded font-medium text-sm">Ctrl</span>}
                  {keyInfo.shiftKey && <span className="px-3 py-1 bg-yellow-200 dark:bg-yellow-700 text-gray-800 dark:text-white rounded font-medium text-sm">Shift</span>}
                  {keyInfo.metaKey && <span className="px-3 py-1 bg-yellow-200 dark:bg-yellow-700 text-gray-800 dark:text-white rounded font-medium text-sm">Meta</span>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolCard>
  )
}
