'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SQLFormatter() {
  const { t } = useLanguage()
  // 입력, 결과, 에러 메시지를 상태로 관리해 번역된 문구를 즉시 반영합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  // 간단한 규칙 기반 포매터: 주요 키워드 앞에 줄바꿈을 추가하고 들여쓰기를 적용합니다.
  const formatSQL = (sql: string): string => {
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING',
      'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
      'ALTER TABLE', 'DROP TABLE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
      'FULL JOIN', 'ON', 'LIMIT', 'OFFSET', 'DISTINCT', 'AS', 'IN', 'NOT IN',
      'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
    ]

    let formatted = sql.trim()

    // 연속 공백을 하나로 축소합니다.
    formatted = formatted.replace(/\s+/g, ' ')

    // 주요 키워드 앞에 줄바꿈을 삽입합니다.
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      formatted = formatted.replace(regex, match => `\n${match.toUpperCase()}`)
    })

    // 줄 단위로 나누어 들여쓰기 규칙을 적용합니다.
    const lines = formatted.split('\n').filter(line => line.trim())
    const indented = lines.map((line) => {
      const trimmed = line.trim()

      if (
        trimmed.startsWith('SELECT') || trimmed.startsWith('FROM') ||
        trimmed.startsWith('WHERE') || trimmed.startsWith('ORDER BY') ||
        trimmed.startsWith('GROUP BY') || trimmed.startsWith('HAVING') ||
        trimmed.startsWith('INSERT') || trimmed.startsWith('UPDATE') ||
        trimmed.startsWith('DELETE') || trimmed.startsWith('CREATE') ||
        trimmed.startsWith('ALTER') || trimmed.startsWith('DROP')
      ) {
        return trimmed
      }

      if (
        trimmed.startsWith('AND') || trimmed.startsWith('OR') ||
        trimmed.startsWith('JOIN') || trimmed.startsWith('INNER JOIN') ||
        trimmed.startsWith('LEFT JOIN') || trimmed.startsWith('RIGHT JOIN') ||
        trimmed.startsWith('ON') || trimmed.startsWith('SET') ||
        trimmed.startsWith('VALUES')
      ) {
        return `  ${trimmed}`
      }

      return `    ${trimmed}`
    })

    return indented.join('\n')
  }

  // 입력을 포맷하고 예외 시 번역된 에러 메시지를 노출합니다.
  const handleFormat = () => {
    try {
      setError('')
      if (!input.trim()) {
        setError(t('sql.error.required'))
        return
      }
      const formatted = formatSQL(input)
      setOutput(formatted)
    } catch (e) {
      setError(t('sql.error.format', { message: e instanceof Error ? e.message : t('sql.error.unknown') }))
      setOutput('')
    }
  }

  // 공백을 하나로 줄여 압축 버전을 제공합니다.
  const handleMinify = () => {
    try {
      setError('')
      if (!input.trim()) {
        setError(t('sql.error.required'))
        return
      }
      const minified = input.replace(/\s+/g, ' ').trim()
      setOutput(minified)
    } catch (e) {
      setError(t('sql.error.minify', { message: e instanceof Error ? e.message : t('sql.error.unknown') }))
      setOutput('')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <ToolCard
      title={`🗃️ ${t('sql.title')}`}
      description={t('sql.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          placeholder={t('sql.input.placeholder')}
          label={t('sql.input.label')}
          rows={10}
        />

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleFormat}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('sql.actions.format')}
          </button>
          <button
            onClick={handleMinify}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('sql.actions.minify')}
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('sql.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          placeholder={t('sql.result.placeholder')}
          readOnly
          label={t('sql.result.label')}
          rows={10}
        />
      </div>
    </ToolCard>
  )
}
