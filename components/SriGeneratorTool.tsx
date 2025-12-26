'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { computeSri, SriAlgorithm } from '@/utils/sri'

const ALGORITHMS: SriAlgorithm[] = ['sha256', 'sha384', 'sha512']

export default function SriGeneratorTool() {
  const { t } = useLanguage()
  // Track user input, selected algorithm, and computed output.
  const [input, setInput] = useState('')
  const [algorithm, setAlgorithm] = useState<SriAlgorithm>('sha256')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    try {
      setError('')
      // Compute the SRI hash from the raw content.
      const sri = await computeSri(input, algorithm)
      setOutput(sri)
    } catch (err) {
      const message = err instanceof Error ? err.message : t('sri.error.generic')
      setError(message)
      setOutput('')
    }
  }

  const handleClear = () => {
    // Clear all state to reset the tool.
    setInput('')
    setOutput('')
    setError('')
    setAlgorithm('sha256')
  }

  return (
    <ToolCard
      title={`🔐 ${t('sri.title')}`}
      description={t('sri.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('sri.input.label')}
          placeholder={t('sri.input.placeholder')}
          rows={8}
        />

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('sri.algorithm.label')}
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as SriAlgorithm)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {ALGORITHMS.map((algo) => (
              <option key={algo} value={algo}>
                {algo}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGenerate}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('sri.actions.generate')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('sri.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('sri.output.label')}
          placeholder={t('sri.output.placeholder')}
          rows={3}
        />
      </div>
    </ToolCard>
  )
}
