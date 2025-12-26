'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { RegexDebuggerError, analyzeRegexMatches } from '@/utils/regexDebugger'

export default function RegexDebuggerTool() {
  const { t } = useLanguage()
  // Track pattern, flags, input, and match output state.
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [input, setInput] = useState('')
  const [matches, setMatches] = useState<ReturnType<typeof analyzeRegexMatches>>([])
  const [error, setError] = useState('')

  const handleAnalyze = () => {
    try {
      setError('')
      // Analyze regex matches and capture groups for debugging.
      const results = analyzeRegexMatches(pattern, flags, input)
      setMatches(results)
    } catch (err) {
      if (err instanceof RegexDebuggerError) {
        setError(t('regexDebugger.error.invalidPattern'))
      } else {
        setError(t('regexDebugger.error.unknown'))
      }
      setMatches([])
    }
  }

  const handleClear = () => {
    // Reset all fields so a new regex can be tested.
    setPattern('')
    setFlags('g')
    setInput('')
    setMatches([])
    setError('')
  }

  return (
    <ToolCard
      title={`🧪 ${t('regexDebugger.title')}`}
      description={t('regexDebugger.description')}
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('regexDebugger.pattern.label')}
            </label>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={t('regexDebugger.pattern.placeholder')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('regexDebugger.flags.label')}
            </label>
            <input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="gim"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
            />
          </div>
        </div>

        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('regexDebugger.input.label')}
          placeholder={t('regexDebugger.input.placeholder')}
          rows={8}
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAnalyze}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('regexDebugger.actions.analyze')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('regexDebugger.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!error && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {t('regexDebugger.stats.label', { count: matches.length })}
            </div>
            {matches.length === 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('regexDebugger.results.empty')}
              </div>
            )}
            {matches.map((match, index) => (
              <div
                key={`${match.index}-${index}`}
                className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="text-sm font-mono text-gray-800 dark:text-gray-100">
                  {t('regexDebugger.results.matchLabel', { index: match.index })}: {match.match}
                </div>
                {match.groups.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                    {t('regexDebugger.results.groups')}: {match.groups.join(', ')}
                  </div>
                )}
                {Object.keys(match.namedGroups).length > 0 && (
                  <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                    {t('regexDebugger.results.namedGroups')}: {JSON.stringify(match.namedGroups)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
