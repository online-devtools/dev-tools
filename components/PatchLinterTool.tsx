'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { lintPatch, PatchLintResult } from '@/utils/patchLinter'

// Sample diff text to showcase linting warnings.
const samplePatch = [
  'diff --git a/foo.txt b/foo.txt',
  '--- a/foo.txt',
  '+++ b/foo.txt',
  '@@ -1,2 +1,2 @@',
  '-hello',
  '+hello ',
  '\\ No newline at end of file',
].join('\n')

export default function PatchLinterTool() {
  const { t } = useLanguage()
  // Track input, threshold, output, and error states for the linter.
  const [input, setInput] = useState('')
  const [threshold, setThreshold] = useState('200')
  const [result, setResult] = useState<PatchLintResult | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = () => {
    const trimmed = input.trim()
    if (!trimmed) {
      setError(t('patchLinter.error.empty'))
      setResult(null)
      return
    }

    const parsedThreshold = Number.parseInt(threshold, 10)
    if (!Number.isFinite(parsedThreshold) || parsedThreshold <= 0) {
      setError(t('patchLinter.error.threshold'))
      setResult(null)
      return
    }

    setError('')
    // Run the lint pass with the selected large patch threshold.
    const lintResult = lintPatch(trimmed, { largePatchThreshold: parsedThreshold })
    setResult(lintResult)
  }

  const handleSample = () => {
    // Seed the input with a known diff example.
    setInput(samplePatch)
    setResult(null)
    setError('')
  }

  const handleClear = () => {
    // Clear the form and reset all outputs.
    setInput('')
    setResult(null)
    setError('')
  }

  return (
    <ToolCard title={`🧹 ${t('patchLinter.title')}`} description={t('patchLinter.description')}>
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('patchLinter.input.label')}
          placeholder={t('patchLinter.input.placeholder')}
          rows={10}
        />

        <div className="grid gap-4 md:grid-cols-[200px_1fr] items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('patchLinter.options.threshold.label')}
            </label>
            <input
              type="number"
              min={1}
              value={threshold}
              onChange={(event) => setThreshold(event.target.value)}
              placeholder={t('patchLinter.options.threshold.placeholder')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {t('patchLinter.options.threshold.helper')}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAnalyze}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('patchLinter.actions.analyze')}
          </button>
          <button
            onClick={handleSample}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('patchLinter.actions.sample')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('patchLinter.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-yellow-200 dark:border-yellow-900/40 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-200">
                {t('patchLinter.summary.trailingWhitespace', { count: result.summary.trailingWhitespace })}
              </div>
              <div className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-200">
                {t('patchLinter.summary.missingNewline', { count: result.summary.missingNewlineMarkers })}
              </div>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-sm text-blue-700 dark:text-blue-200">
                {t('patchLinter.summary.largePatch', { count: result.summary.largePatch })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {t('patchLinter.issues.title')}
              </div>
              {result.issues.length === 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('patchLinter.issues.empty')}
                </div>
              )}
              {result.issues.map((issue, index) => (
                <div
                  key={`${issue.type}-${issue.file}-${index}`}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200"
                >
                  <div className="font-semibold text-gray-800 dark:text-gray-100">
                    {issue.file}
                  </div>
                  {issue.line && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">{issue.line}</div>
                  )}
                  <div className="mt-1">{issue.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
