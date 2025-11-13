'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function SQLFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const formatSQL = (sql: string): string => {
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING',
      'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
      'ALTER TABLE', 'DROP TABLE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
      'FULL JOIN', 'ON', 'LIMIT', 'OFFSET', 'DISTINCT', 'AS', 'IN', 'NOT IN',
      'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
    ]

    let formatted = sql.trim()

    // Remove extra spaces
    formatted = formatted.replace(/\s+/g, ' ')

    // Add line breaks before major keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      formatted = formatted.replace(regex, match => `\n${match.toUpperCase()}`)
    })

    // Indent clauses
    const lines = formatted.split('\n').filter(line => line.trim())
    const indented = lines.map((line, index) => {
      line = line.trim()

      // Main clauses (no indent)
      if (line.startsWith('SELECT') || line.startsWith('FROM') ||
          line.startsWith('WHERE') || line.startsWith('ORDER BY') ||
          line.startsWith('GROUP BY') || line.startsWith('HAVING') ||
          line.startsWith('INSERT') || line.startsWith('UPDATE') ||
          line.startsWith('DELETE') || line.startsWith('CREATE') ||
          line.startsWith('ALTER') || line.startsWith('DROP')) {
        return line
      }

      // Sub-clauses (indent)
      if (line.startsWith('AND') || line.startsWith('OR') ||
          line.startsWith('JOIN') || line.startsWith('INNER JOIN') ||
          line.startsWith('LEFT JOIN') || line.startsWith('RIGHT JOIN') ||
          line.startsWith('ON') || line.startsWith('SET') ||
          line.startsWith('VALUES')) {
        return '  ' + line
      }

      // Default: slight indent
      return '    ' + line
    })

    return indented.join('\n')
  }

  const handleFormat = () => {
    try {
      setError('')
      if (!input.trim()) {
        setError('SQL 쿼리를 입력해주세요.')
        return
      }
      const formatted = formatSQL(input)
      setOutput(formatted)
    } catch (e) {
      setError(`포맷 실패: ${e instanceof Error ? e.message : '알 수 없는 오류'}`)
      setOutput('')
    }
  }

  const handleMinify = () => {
    try {
      setError('')
      if (!input.trim()) {
        setError('SQL 쿼리를 입력해주세요.')
        return
      }
      const minified = input.replace(/\s+/g, ' ').trim()
      setOutput(minified)
    } catch (e) {
      setError(`압축 실패: ${e instanceof Error ? e.message : '알 수 없는 오류'}`)
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
      title="🗃️ SQL Formatter"
      description="SQL 쿼리를 포맷하고 최적화합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          placeholder="SELECT * FROM users WHERE id = 1"
          label="입력 SQL"
          rows={10}
        />

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleFormat}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Format
          </button>
          <button
            onClick={handleMinify}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            Minify
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          placeholder="포맷된 SQL이 여기에 표시됩니다..."
          readOnly
          label="결과"
          rows={10}
        />
      </div>
    </ToolCard>
  )
}
