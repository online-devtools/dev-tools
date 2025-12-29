'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Seoul',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
]

const parseDateParts = (value: string) => {
  const match = value.trim().match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/) 
  if (!match) return null
  const [, year, month, day, hour = '00', minute = '00', second = '00'] = match
  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
  }
}

const getTimeZoneOffsetMs = (date: Date, timeZone: string) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const parts = formatter.formatToParts(date)
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value || 0)

  const utcTime = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  return utcTime - date.getTime()
}

const buildDateInTimeZone = (parts: ReturnType<typeof parseDateParts>, timeZone: string) => {
  if (!parts) return null
  const utcTime = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
  const utcDate = new Date(utcTime)
  const offset = getTimeZoneOffsetMs(utcDate, timeZone)
  return new Date(utcTime - offset)
}

export default function TimezoneConverterTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [sourceZone, setSourceZone] = useState('UTC')
  const [targets, setTargets] = useState<string[]>(['UTC', 'Asia/Seoul', 'America/New_York'])
  const [error, setError] = useState('')

  const parsedDate = useMemo(() => {
    if (!input.trim()) return null
    const parsed = parseDateParts(input)
    if (!parsed) return null
    return buildDateInTimeZone(parsed, sourceZone)
  }, [input, sourceZone])

  const formatted = useMemo(() => {
    if (!parsedDate) return []
    return targets.map((zone) => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      return {
        zone,
        value: formatter.format(parsedDate),
      }
    })
  }, [parsedDate, targets])

  const handleConvert = () => {
    if (!input.trim()) {
      setError(t('timezone.error.empty'))
      return
    }
    if (!parsedDate) {
      setError(t('timezone.error.format'))
      return
    }
    setError('')
  }

  return (
    <ToolCard title={`🕒 ${t('timezone.title')}`} description={t('timezone.description')}>
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('timezone.input')}</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="2025-01-01 09:00:00"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('timezone.source')}</label>
            <select
              value={sourceZone}
              onChange={(e) => setSourceZone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {TIMEZONES.map((zone) => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('timezone.targets')}</label>
            <div className="flex flex-wrap gap-2">
              {TIMEZONES.map((zone) => (
                <label key={zone} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={targets.includes(zone)}
                    onChange={(e) => {
                      setTargets((prev) =>
                        e.target.checked ? [...prev, zone] : prev.filter((item) => item !== zone)
                      )
                    }}
                  />
                  {zone}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={handleConvert} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            {t('timezone.convert')}
          </button>
          <button
            onClick={() => {
              setInput('')
              setError('')
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
          >
            {t('timezone.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {formatted.length > 0 && (
          <div className="space-y-2">
            {formatted.map((item) => (
              <div key={item.zone} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">{item.zone}</div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
