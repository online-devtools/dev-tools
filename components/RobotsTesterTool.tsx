'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  RobotsTxtError,
  RobotsTestResult,
  testRobotsTxt,
} from '@/utils/robotsTester'

// Sample robots.txt content to demonstrate allow/disallow behavior quickly.
const sampleRobotsTxt = [
  'User-agent: *',
  'Disallow: /admin',
  'Allow: /admin/help',
  '',
  'User-agent: Googlebot',
  'Disallow: /private',
].join('\n')

export default function RobotsTesterTool() {
  const { t } = useLanguage()
  // Track input state and analysis output for rendering results.
  const [robotsInput, setRobotsInput] = useState('')
  const [userAgent, setUserAgent] = useState('*')
  const [targetPath, setTargetPath] = useState('/')
  const [result, setResult] = useState<RobotsTestResult | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = () => {
    try {
      setError('')
      // Evaluate the target path against the robots.txt rules.
      const analysis = testRobotsTxt(robotsInput, userAgent, targetPath)
      setResult(analysis)
    } catch (err) {
      setResult(null)
      if (err instanceof RobotsTxtError) {
        if (err.code === 'empty') {
          setError(t('robotsTester.error.empty'))
          return
        }
        if (err.code === 'invalid') {
          setError(t('robotsTester.error.invalidLine', { line: err.line ?? '-' }))
          return
        }
      }
      setError(t('robotsTester.error.unknown'))
    }
  }

  const handleSample = () => {
    // Load a sample robots.txt and reset the output.
    setRobotsInput(sampleRobotsTxt)
    setUserAgent('*')
    setTargetPath('/admin/help')
    setResult(null)
    setError('')
  }

  const handleClear = () => {
    // Clear all inputs and results to start over.
    setRobotsInput('')
    setUserAgent('*')
    setTargetPath('/')
    setResult(null)
    setError('')
  }

  return (
    <ToolCard
      title={`🤖 ${t('robotsTester.title')}`}
      description={t('robotsTester.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={robotsInput}
          onChange={setRobotsInput}
          label={t('robotsTester.input.robots')}
          placeholder={t('robotsTester.input.robotsPlaceholder')}
          rows={10}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('robotsTester.input.userAgent')}
            </label>
            <input
              value={userAgent}
              onChange={(event) => setUserAgent(event.target.value)}
              placeholder={t('robotsTester.input.userAgentPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('robotsTester.input.target')}
            </label>
            <input
              value={targetPath}
              onChange={(event) => setTargetPath(event.target.value)}
              placeholder={t('robotsTester.input.targetPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAnalyze}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('robotsTester.actions.analyze')}
          </button>
          <button
            onClick={handleSample}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('robotsTester.actions.sample')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('robotsTester.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div
              className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
                result.allowed
                  ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200'
                  : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200'
              }`}
            >
              {result.allowed
                ? t('robotsTester.result.allowed')
                : t('robotsTester.result.disallowed')}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {t('robotsTester.result.reason')}: {t(`robotsTester.result.reason.${result.reason}`)}
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {t('robotsTester.result.group')}:{' '}
                {result.matchedGroup?.agents.join(', ') || '-'}
              </div>
            </div>

            {result.matchedRule && (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {t('robotsTester.result.matchedRule')}:{' '}
                <span className="font-mono">
                  {result.matchedRule.type.toUpperCase()} {result.matchedRule.path}
                </span>
              </div>
            )}

            {result.matchedGroup && result.matchedGroup.rules.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {t('robotsTester.result.rulesTitle')}
                </div>
                <div className="space-y-2">
                  {result.matchedGroup.rules.map((rule) => (
                    <div
                      key={`${rule.type}-${rule.path}-${rule.line}`}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-xs font-mono text-gray-700 dark:text-gray-200"
                    >
                      {rule.type === 'allow'
                        ? t('robotsTester.result.ruleAllow')
                        : t('robotsTester.result.ruleDisallow')}{' '}
                      {rule.path}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolCard>
  )
}
