'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

interface EnvVariable {
  id: number
  key: string
  value: string
  comment: string
}

type OutputFormat = 'env' | 'json' | 'yaml' | 'export'

export default function EnvManagerTool() {
  const { t } = useLanguage()
  const [variables, setVariables] = useState<EnvVariable[]>([
    { id: 1, key: '', value: '', comment: '' },
  ])
  const [nextId, setNextId] = useState(2)
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('env')
  const [error, setError] = useState('')

  const addVariable = () => {
    setVariables([
      ...variables,
      { id: nextId, key: '', value: '', comment: '' },
    ])
    setNextId(nextId + 1)
  }

  const removeVariable = (id: number) => {
    if (variables.length <= 1) return
    setVariables(variables.filter(v => v.id !== id))
  }

  const updateVariable = (id: number, field: keyof EnvVariable, value: string) => {
    setVariables(variables.map(v => (v.id === id ? { ...v, [field]: value } : v)))
  }

  const parseEnvInput = (input: string) => {
    setError('')
    const lines = input.split('\n')
    const parsed: EnvVariable[] = []
    let currentComment = ''
    let id = 1

    for (const line of lines) {
      const trimmed = line.trim()

      // Skip empty lines
      if (!trimmed) {
        currentComment = ''
        continue
      }

      // Comment line
      if (trimmed.startsWith('#')) {
        currentComment = trimmed.substring(1).trim()
        continue
      }

      // Parse KEY=VALUE
      const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i)
      if (match) {
        const [, key, value] = match
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, '')
        parsed.push({ id: id++, key, value: cleanValue, comment: currentComment })
        currentComment = ''
      } else {
        setError(t('envManager.error.invalidFormat', { line: trimmed }))
      }
    }

    if (parsed.length > 0) {
      setVariables(parsed)
      setNextId(id)
    }
  }

  const generateOutput = () => {
    // Filter out empty variables
    const validVars = variables.filter(v => v.key.trim() !== '')

    // Check for duplicates
    const keys = validVars.map(v => v.key.trim())
    const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index)
    if (duplicates.length > 0) {
      setError(t('envManager.error.duplicateKey', { key: duplicates[0] }))
      return ''
    }

    setError('')

    switch (outputFormat) {
      case 'env':
        return validVars
          .map(v => {
            const comment = v.comment ? `# ${v.comment}\n` : ''
            const value = v.value.includes(' ') || v.value.includes('#')
              ? `"${v.value}"`
              : v.value
            return `${comment}${v.key}=${value}`
          })
          .join('\n')

      case 'export':
        return validVars
          .map(v => {
            const comment = v.comment ? `# ${v.comment}\n` : ''
            const value = v.value.includes(' ') || v.value.includes('#')
              ? `"${v.value}"`
              : v.value
            return `${comment}export ${v.key}=${value}`
          })
          .join('\n')

      case 'json':
        const jsonObj = validVars.reduce((acc, v) => {
          acc[v.key] = v.value
          return acc
        }, {} as Record<string, string>)
        return JSON.stringify(jsonObj, null, 2)

      case 'yaml':
        return validVars
          .map(v => {
            const comment = v.comment ? `# ${v.comment}\n` : ''
            const value = v.value.includes(':') || v.value.includes('#')
              ? `"${v.value}"`
              : v.value
            return `${comment}${v.key}: ${value}`
          })
          .join('\n')

      default:
        return ''
    }
  }

  return (
    <ToolCard
      title={t('envManager.title')}
      description={t('envManager.description')}
    >
      <div className="space-y-6">
        {/* Variables Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('envManager.variables')}
            </label>
            <button
              onClick={addVariable}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + {t('envManager.addVariable')}
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {variables.map((variable) => (
              <div
                key={variable.id}
                className="grid grid-cols-12 gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <input
                  type="text"
                  value={variable.key}
                  onChange={(e) => updateVariable(variable.id, 'key', e.target.value)}
                  placeholder={t('envManager.keyPlaceholder')}
                  className="col-span-3 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-sm font-mono"
                />
                <input
                  type="text"
                  value={variable.value}
                  onChange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                  placeholder={t('envManager.valuePlaceholder')}
                  className="col-span-4 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-sm font-mono"
                />
                <input
                  type="text"
                  value={variable.comment}
                  onChange={(e) => updateVariable(variable.id, 'comment', e.target.value)}
                  placeholder={t('envManager.commentPlaceholder')}
                  className="col-span-4 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-sm"
                />
                <button
                  onClick={() => removeVariable(variable.id)}
                  disabled={variables.length <= 1}
                  className="col-span-1 px-2 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Import from text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('envManager.import')}
          </label>
          <textarea
            placeholder={t('envManager.importPlaceholder')}
            onChange={(e) => {
              if (e.target.value.trim()) {
                parseEnvInput(e.target.value)
              }
            }}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm"
            rows={4}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Output Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('envManager.outputFormat')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(['env', 'export', 'json', 'yaml'] as OutputFormat[]).map(format => (
              <button
                key={format}
                onClick={() => setOutputFormat(format)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  outputFormat === format
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Output */}
        <TextAreaWithCopy
          value={generateOutput()}
          readOnly
          label={t('envManager.output')}
          rows={12}
        />

        {/* Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            {t('envManager.infoTitle')}
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>{t('envManager.info1')}</li>
            <li>{t('envManager.info2')}</li>
            <li>{t('envManager.info3')}</li>
            <li>{t('envManager.info4')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
