'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

function describeCron(cron: string, t: (k: string, r?: Record<string, string | number>) => string): string {
  // 매우 단순한 설명 생성기: 분 시 일 월 요일 다섯 필드를 기준으로 설명합니다.
  const parts = cron.trim().split(/\s+/)
  if (parts.length < 5) return t('cronHuman.error.invalid')
  const [min, hour, dom, mon, dow] = parts
  return t('cronHuman.description.summary', { min, hour, dom, mon, dow })
}

function nextTimes(cron: string, count: number): string[] {
  // 의존성 없이 간단히: 분, 시, 일, 월, 요일을 *나 숫자만 처리합니다.
  const parts = cron.trim().split(/\s+/)
  if (parts.length < 5) return []
  const [min, hour, dom, mon, dow] = parts.map((p) => (p === '*' ? null : parseInt(p, 10)))
  const results: string[] = []
  let current = new Date()
  let attempts = 0
  while (results.length < count && attempts < 50000) {
    current = new Date(current.getTime() + 60_000) // 1분씩 증가
    attempts++
    if (
      (min === null || current.getMinutes() === min) &&
      (hour === null || current.getHours() === hour) &&
      (dom === null || current.getDate() === dom) &&
      (mon === null || current.getMonth() + 1 === mon) &&
      (dow === null || current.getDay() === (dow === 7 ? 0 : dow))
    ) {
      results.push(current.toISOString())
    }
  }
  return results
}

export default function CronHumanTool() {
  const { t } = useLanguage()
  // 크론 표현식과 설명/다음 실행 시각, 에러 상태를 관리합니다.
  const [cron, setCron] = useState('*/5 * * * *')
  const [human, setHuman] = useState('')
  const [upcoming, setUpcoming] = useState<string[]>([])
  const [error, setError] = useState('')

  const handleConvert = () => {
    try {
      setError('')
      const desc = describeCron(cron, t)
      const times = nextTimes(cron, 5)
      if (times.length === 0) {
        setError(t('cronHuman.error.compute'))
        setHuman('')
        setUpcoming([])
        return
      }
      setHuman(desc)
      setUpcoming(times)
    } catch (e) {
      setError(t('cronHuman.error.compute'))
      setHuman('')
      setUpcoming([])
    }
  }

  return (
    <ToolCard
      title={`⏱️ ${t('cronHuman.title')}`}
      description={t('cronHuman.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={cron}
          onChange={setCron}
          label={t('cronHuman.input.label')}
          placeholder="*/5 * * * *"
          rows={2}
        />

        <button
          onClick={handleConvert}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('cronHuman.actions.convert')}
        </button>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {human && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">{t('cronHuman.result.description')}</div>
            <div className="font-mono text-gray-900 dark:text-white">{human}</div>
          </div>
        )}

        {upcoming.length > 0 && (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {t('cronHuman.result.next')}
            </div>
            <div className="space-y-1 text-sm font-mono text-gray-800 dark:text-gray-100">
              {upcoming.map((time) => (
                <div key={time}>{time}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
