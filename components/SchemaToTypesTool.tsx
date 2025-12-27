'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { generateTypeScriptFromSchema, JsonSchema } from '@/utils/schemaToTypes'

export default function SchemaToTypesTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [rootName, setRootName] = useState('Root')
  const [output, setOutput] = useState('')
  const [warnings, setWarnings] = useState<string[]>([])
  const [error, setError] = useState('')

  const handleGenerate = () => {
    if (!input.trim()) {
      setError(t('schemaToTs.error.empty'))
      setOutput('')
      setWarnings([])
      return
    }

    try {
      setError('')
      const parsedSchema = JSON.parse(input) as JsonSchema
      const result = generateTypeScriptFromSchema(parsedSchema, rootName)
      setOutput(result.types)
      setWarnings(result.warnings)
    } catch {
      setError(t('schemaToTs.error.invalidJson'))
      setOutput('')
      setWarnings([])
    }
  }

  const handleClear = () => {
    setInput('')
    setRootName('Root')
    setOutput('')
    setWarnings([])
    setError('')
  }

  return (
    <ToolCard
      title={`🧬 ${t('schemaToTs.title')}`}
      description={t('schemaToTs.description')}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('schemaToTs.input.label')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('schemaToTs.input.placeholder')}
            rows={10}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('schemaToTs.rootName.label')}
          </label>
          <input
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            placeholder={t('schemaToTs.rootName.placeholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGenerate}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('schemaToTs.actions.generate')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('schemaToTs.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {warnings.length > 0 && !error && (
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-200 rounded-lg text-sm space-y-1">
            <div className="font-semibold">{t('schemaToTs.warnings.title')}</div>
            {warnings.map((warning) => (
              <div key={warning}>{warning}</div>
            ))}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          onChange={setOutput}
          label={t('schemaToTs.output.label')}
          placeholder={t('schemaToTs.output.placeholder')}
          readOnly
          rows={10}
        />
      </div>
    </ToolCard>
  )
}
