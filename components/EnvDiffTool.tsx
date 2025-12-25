'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { EnvDiffError, EnvDiffResult, diffEnv } from '@/utils/envDiff'

type DiffListProps = {
  title: string
  items: string[]
  emptyLabel: string
  accentClass: string
}

const DiffList = ({ title, items, emptyLabel, accentClass }: DiffListProps) => {
  // Render each diff category with a consistent layout and fallback text.
  return (
    <div className={`rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${accentClass}`}>
      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
        {title}
      </h4>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {emptyLabel}
        </p>
      ) : (
        <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1 font-mono">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function EnvDiffTool() {
  const { t } = useLanguage()
  // Track left/right inputs plus diff results to keep the UI responsive.
  const [leftInput, setLeftInput] = useState('')
  const [rightInput, setRightInput] = useState('')
  const [diffResult, setDiffResult] = useState<EnvDiffResult | null>(null)
  const [error, setError] = useState('')

  const formatError = (err: unknown): string => {
    // Translate structured parsing errors into localized messages.
    if (err instanceof EnvDiffError) {
      if (err.code === 'empty') {
        return t('envDiff.error.empty')
      }
      if (err.code === 'invalidLine') {
        return t('envDiff.error.invalidLine', { line: err.line ?? '-' })
      }
    }
    return t('envDiff.error.unknown')
  }

  const handleDiff = () => {
    try {
      setError('')
      // Calculate the diff so the UI can highlight added/removed/changed keys.
      const result = diffEnv(leftInput, rightInput)
      setDiffResult(result)
    } catch (err) {
      setError(formatError(err))
      setDiffResult(null)
    }
  }

  const handleClear = () => {
    // Reset the tool so users can start a fresh comparison.
    setLeftInput('')
    setRightInput('')
    setDiffResult(null)
    setError('')
  }

  return (
    <ToolCard
      title={`🧪 ${t('envDiff.title')}`}
      description={t('envDiff.description')}
    >
      <div className="space-y-4">
        {/* Left/right .env inputs are shown side by side on wider screens. */}
        <div className="grid gap-4 md:grid-cols-2">
          <TextAreaWithCopy
            value={leftInput}
            onChange={setLeftInput}
            label={t('envDiff.left.label')}
            placeholder={t('envDiff.left.placeholder')}
            rows={10}
          />
          <TextAreaWithCopy
            value={rightInput}
            onChange={setRightInput}
            label={t('envDiff.right.label')}
            placeholder={t('envDiff.right.placeholder')}
            rows={10}
          />
        </div>

        {/* Diff and clear actions align with the state handlers above. */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDiff}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('envDiff.actions.diff')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('envDiff.actions.clear')}
          </button>
        </div>

        {/* Display parser errors prominently so users can fix invalid lines. */}
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Render diff results only when a valid comparison is available. */}
        {diffResult && !error && (
          <div className="space-y-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {t('envDiff.summary', {
                added: diffResult.added.length,
                removed: diffResult.removed.length,
                changed: diffResult.changed.length,
                unchanged: diffResult.unchanged.length,
              })}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <DiffList
                title={t('envDiff.lists.added')}
                items={diffResult.added}
                emptyLabel={t('envDiff.lists.empty')}
                accentClass="bg-green-50 dark:bg-green-900/10"
              />
              <DiffList
                title={t('envDiff.lists.removed')}
                items={diffResult.removed}
                emptyLabel={t('envDiff.lists.empty')}
                accentClass="bg-red-50 dark:bg-red-900/10"
              />
              <DiffList
                title={t('envDiff.lists.changed')}
                items={diffResult.changed}
                emptyLabel={t('envDiff.lists.empty')}
                accentClass="bg-yellow-50 dark:bg-yellow-900/10"
              />
              <DiffList
                title={t('envDiff.lists.unchanged')}
                items={diffResult.unchanged}
                emptyLabel={t('envDiff.lists.empty')}
                accentClass="bg-gray-50 dark:bg-gray-800/30"
              />
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
