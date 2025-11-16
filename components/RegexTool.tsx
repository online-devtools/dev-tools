'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'
import { runRegexTest } from '@/utils/regex'

// Errors surface translation keys so we can reuse LanguageContext.t()
type TranslatableMessage = {
  key: string
  replacements?: Record<string, string | number>
}

export default function RegexTool() {
  const { t } = useLanguage()
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')
  const [matches, setMatches] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<TranslatableMessage | null>(null)

  // Delegate the regex execution to a utility for easier unit testing.
  const handleTest = () => {
    try {
      const result = runRegexTest(pattern, flags, testString)
      if (result.hasMatches) {
        setMatches(result.matches)
        setErrorMessage(null)
      } else {
        setMatches([])
        setErrorMessage({ key: 'regex.error.noMatch' })
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : ''
      if (message.startsWith('regex.')) {
        setErrorMessage({ key: message })
      } else {
        setErrorMessage({
          key: 'regex.error.syntax',
          replacements: { message: message || 'Unknown error' },
        })
      }
      setMatches([])
    }
  }

  const handleClear = () => {
    setPattern('')
    setFlags('g')
    setTestString('')
    setMatches([])
    setErrorMessage(null)
  }

  // Quick presets expose frequently used expressions without memorizing syntax.
  const commonPatterns = [
    { nameKey: 'regex.commonPatterns.email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { nameKey: 'regex.commonPatterns.url', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
    { nameKey: 'regex.commonPatterns.phone', pattern: '01[0-9]-?[0-9]{3,4}-?[0-9]{4}' },
    { nameKey: 'regex.commonPatterns.ip', pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b' },
    { nameKey: 'regex.commonPatterns.hex', pattern: '#[0-9A-Fa-f]{6}' },
  ]

  return (
    <ToolCard
      title={`🔍 ${t('regex.title')}`}
      description={t('regex.description')}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('regex.pattern.label')}
            </label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={t('regex.pattern.placeholder')}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('regex.flags.label')}
            </label>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder={t('regex.flags.placeholder')}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('regex.commonPatterns.label')}
          </label>
          <div className="flex flex-wrap gap-2">
            {commonPatterns.map((p) => (
              <button
                key={p.nameKey}
                onClick={() => setPattern(p.pattern)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded-md transition-colors"
              >
                {t(p.nameKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('regex.testString.label')}
          </label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder={t('regex.testString.placeholder')}
            rows={6}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleTest}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('regex.actions.test')}
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('regex.actions.clear')}
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {t(errorMessage.key, errorMessage.replacements)}
          </div>
        )}

        {matches.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('regex.results.label', { count: matches.length })}
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className="p-3 bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700 dark:text-green-200">
                      {t('regex.results.match', { index: index + 1 })}
                    </span>
                    <code className="font-mono text-sm font-bold text-green-900 dark:text-green-100">
                      {match}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
