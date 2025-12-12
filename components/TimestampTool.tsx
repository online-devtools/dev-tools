'use client'

import React, { useState, useEffect } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TimestampTool() {
  const { t, language } = useLanguage()
  // 현재 타임스탬프, 입력, 결과, 에러 상태를 관리합니다.
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now())
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const locale = language === 'ko' ? 'ko-KR' : 'en-US'

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleToDate = () => {
    try {
      setError('')
      const timestamp = parseInt(input, 10)
      if (isNaN(timestamp)) {
        setError(t('timestamp.error.invalidTimestamp'))
        return
      }
      const date = new Date(timestamp)
      setOutput(date.toLocaleString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Seoul'
      }))
    } catch (e) {
      setError(t('timestamp.error.convertTimestamp'))
      setOutput('')
    }
  }

  const handleToTimestamp = () => {
    try {
      setError('')
      const date = new Date(input)
      if (isNaN(date.getTime())) {
        setError(t('timestamp.error.invalidDate'))
        return
      }
      setOutput(date.getTime().toString())
    } catch (e) {
      setError(t('timestamp.error.convertDate'))
      setOutput('')
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  return (
    <ToolCard
      title={`⏰ ${t('timestamp.title')}`}
      description={t('timestamp.description')}
    >
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-lg">
          <div className="text-sm text-blue-700 dark:text-blue-200 mb-2">
            {t('timestamp.current.label')}
          </div>
          <div className="flex items-center justify-between">
            <div className="font-mono text-lg font-bold text-blue-900 dark:text-blue-100">
              {currentTimestamp}
            </div>
            <button
              onClick={() => copyToClipboard(currentTimestamp.toString())}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
            >
              {t('common.copy')}
            </button>
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-300 mt-2">
            {new Date(currentTimestamp).toLocaleString(locale, { timeZone: 'Asia/Seoul' })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('timestamp.input.label')}
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('timestamp.input.placeholder')}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleToDate}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('timestamp.actions.toDate')}
          </button>
          <button
            onClick={handleToTimestamp}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('timestamp.actions.toTimestamp')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {output && (
          <div className="p-4 bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg">
            <div className="text-sm text-green-700 dark:text-green-200 mb-2">
              {t('timestamp.result.label')}
            </div>
            <div className="flex items-center justify-between">
              <div className="font-mono text-lg font-bold text-green-900 dark:text-green-100 break-all">
                {output}
              </div>
              <button
                onClick={() => copyToClipboard(output)}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition-colors ml-2"
              >
                {t('common.copy')}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
