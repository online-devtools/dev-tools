'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'

export default function CronParser() {
  const [cronExpression, setCronExpression] = useState('0 0 * * *')
  const [description, setDescription] = useState('')
  const [nextRuns, setNextRuns] = useState<string[]>([])
  const [error, setError] = useState('')

  const parseCron = (expression: string): string => {
    const parts = expression.trim().split(/\s+/)
    if (parts.length < 5 || parts.length > 6) {
      throw new Error('Invalid cron expression format')
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek, year] = parts

    const parseField = (value: string, name: string, max: number): string => {
      if (value === '*') return `every ${name}`
      if (value.includes('/')) {
        const [range, step] = value.split('/')
        return `every ${step} ${name}(s)`
      }
      if (value.includes(',')) {
        return `at ${name} ${value.split(',').join(', ')}`
      }
      if (value.includes('-')) {
        return `${name} ${value.replace('-', ' to ')}`
      }
      return `at ${name} ${value}`
    }

    const minuteDesc = parseField(minute, 'minute', 59)
    const hourDesc = parseField(hour, 'hour', 23)
    const dayDesc = dayOfMonth === '*' ? 'every day' : `on day ${dayOfMonth}`
    const monthDesc = month === '*' ? 'every month' : `in month ${month}`
    const weekdayDesc = dayOfWeek === '*' ? '' : `on weekday ${dayOfWeek}`

    return `${minuteDesc}, ${hourDesc}, ${dayDesc}, ${monthDesc}${weekdayDesc ? ', ' + weekdayDesc : ''}`
  }

  const getNextRuns = (expression: string, count: number = 5): string[] => {
    const runs: string[] = []
    const parts = expression.trim().split(/\s+/)

    if (parts.length < 5) return runs

    const [minute, hour] = parts

    // Simplified: just show next 5 occurrences based on hour and minute
    const now = new Date()
    let currentDate = new Date(now)

    for (let i = 0; i < count; i++) {
      if (minute === '*' && hour === '*') {
        currentDate = new Date(currentDate.getTime() + 60000) // every minute
      } else if (hour === '*') {
        const targetMinute = minute === '*' ? 0 : parseInt(minute)
        currentDate.setMinutes(targetMinute)
        currentDate = new Date(currentDate.getTime() + 3600000) // every hour
      } else {
        const targetHour = parseInt(hour)
        const targetMinute = minute === '*' ? 0 : parseInt(minute)
        currentDate.setHours(targetHour, targetMinute, 0, 0)
        currentDate = new Date(currentDate.getTime() + 86400000) // next day
      }

      runs.push(currentDate.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }))
    }

    return runs
  }

  const handleParse = () => {
    try {
      setError('')
      const desc = parseCron(cronExpression)
      setDescription(desc)
      const runs = getNextRuns(cronExpression)
      setNextRuns(runs)
    } catch (e) {
      setError(`파싱 실패: ${e instanceof Error ? e.message : 'Invalid cron expression'}`)
      setDescription('')
      setNextRuns([])
    }
  }

  const presetExpressions = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Every day at midnight', value: '0 0 * * *' },
    { label: 'Every day at 9 AM', value: '0 9 * * *' },
    { label: 'Every Monday at 9 AM', value: '0 9 * * 1' },
    { label: 'Every 1st of month', value: '0 0 1 * *' },
  ]

  return (
    <ToolCard
      title="⏰ Cron Expression Parser"
      description="Cron 표현식을 해석하고 다음 실행 시간을 확인합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cron Expression
          </label>
          <input
            type="text"
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            placeholder="0 0 * * *"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
          />
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Format: minute hour day month weekday
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quick Presets
          </label>
          <div className="flex gap-2 flex-wrap">
            {presetExpressions.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setCronExpression(preset.value)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleParse}
          className="w-full px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          Parse & Calculate
        </button>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {description && (
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </div>
            <div className="text-green-700 dark:text-green-300">
              {description}
            </div>
          </div>
        )}

        {nextRuns.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Next 5 Executions
            </div>
            <ul className="space-y-1">
              {nextRuns.map((run, index) => (
                <li key={index} className="text-sm text-blue-700 dark:text-blue-300 font-mono">
                  {index + 1}. {run}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
          <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">Cron Format Guide</div>
          <div className="space-y-1 text-gray-600 dark:text-gray-400 font-mono text-xs">
            <div>* * * * * → minute hour day month weekday</div>
            <div>* → every</div>
            <div>*/5 → every 5</div>
            <div>1,2,3 → at 1, 2, and 3</div>
            <div>1-5 → from 1 to 5</div>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
