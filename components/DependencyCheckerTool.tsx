"use client"

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  DependencyParserError,
  parsePackageJsonDependencies,
} from '@/utils/dependencyParser'

type DependencyStatus = {
  name: string
  current: string
  latest: string
  status: 'up-to-date' | 'outdated' | 'unknown'
  scope: 'dependencies' | 'devDependencies'
}

const fetchLatestVersion = async (pkgName: string): Promise<string | null> => {
  // Query the npm registry for the latest dist-tag.
  const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkgName)}`)
  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return data?.['dist-tags']?.latest ?? null
}

export default function DependencyCheckerTool() {
  const { t } = useLanguage()
  // Store input package.json and dependency check results.
  const [input, setInput] = useState('')
  const [results, setResults] = useState<DependencyStatus[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCheck = async () => {
    try {
      setError('')
      setIsLoading(true)
      setResults([])

      // Parse package.json content to extract dependency maps.
      const parsed = parsePackageJsonDependencies(input)
      const entries: DependencyStatus[] = []

      const mergeEntries = (deps: Record<string, string>, scope: DependencyStatus['scope']) => {
        Object.entries(deps).forEach(([name, version]) => {
          entries.push({
            name,
            current: version,
            latest: '',
            status: 'unknown',
            scope,
          })
        })
      }

      mergeEntries(parsed.dependencies, 'dependencies')
      mergeEntries(parsed.devDependencies, 'devDependencies')

      // Fetch latest versions in parallel for faster feedback.
      const enriched = await Promise.all(
        entries.map(async (entry) => {
          const latest = await fetchLatestVersion(entry.name)
          if (!latest) {
            return { ...entry, latest: t('dependencyChecker.status.unknown'), status: 'unknown' as const }
          }

          // TypeScript widens conditional expressions to string without an explicit annotation, so we pin it
          // to DependencyStatus['status'] to satisfy the setResults DependencyStatus[] requirement.
          const status: DependencyStatus['status'] =
            entry.current.replace(/^[^0-9]*/, '') === latest ? 'up-to-date' : 'outdated'
          // Return a full DependencyStatus shape to avoid widening the union to a generic string.
          return { ...entry, latest, status }
        })
      )

      setResults(enriched)
    } catch (err) {
      if (err instanceof DependencyParserError) {
        if (err.code === 'empty') {
          setError(t('dependencyChecker.error.empty'))
        } else if (err.code === 'invalidJson') {
          setError(t('dependencyChecker.error.invalidJson'))
        } else {
          setError(t('dependencyChecker.error.notObject'))
        }
      } else {
        setError(t('dependencyChecker.error.unknown'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    // Reset all fields for a fresh dependency check.
    setInput('')
    setResults([])
    setError('')
    setIsLoading(false)
  }

  return (
    <ToolCard
      title={`📦 ${t('dependencyChecker.title')}`}
      description={t('dependencyChecker.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('dependencyChecker.input.label')}
          placeholder={t('dependencyChecker.input.placeholder')}
          rows={10}
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCheck}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            disabled={isLoading}
          >
            {isLoading ? t('dependencyChecker.actions.checking') : t('dependencyChecker.actions.check')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('dependencyChecker.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {t('dependencyChecker.stats.label', { count: results.length })}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left">{t('dependencyChecker.table.name')}</th>
                    <th className="px-3 py-2 text-left">{t('dependencyChecker.table.scope')}</th>
                    <th className="px-3 py-2 text-left">{t('dependencyChecker.table.current')}</th>
                    <th className="px-3 py-2 text-left">{t('dependencyChecker.table.latest')}</th>
                    <th className="px-3 py-2 text-left">{t('dependencyChecker.table.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((entry) => (
                    <tr key={`${entry.scope}-${entry.name}`} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-3 py-2 font-mono text-gray-800 dark:text-gray-100">{entry.name}</td>
                      <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{entry.scope}</td>
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-200">{entry.current}</td>
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-200">{entry.latest}</td>
                      <td className="px-3 py-2">
                        <span
                          className={
                            entry.status === 'up-to-date'
                              ? 'text-green-600 dark:text-green-400'
                              : entry.status === 'outdated'
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-gray-500 dark:text-gray-400'
                          }
                        >
                          {t(`dependencyChecker.status.${entry.status}`)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
