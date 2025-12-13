'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function JSONSchemaGeneratorTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [includeRequired, setIncludeRequired] = useState(true)
  const [includeDescriptions, setIncludeDescriptions] = useState(false)

  const inferType = (value: any): any => {
    if (value === null) {
      return { type: 'null' }
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return { type: 'array', items: {} }
      }

      // Analyze all items to determine the schema
      const itemSchemas = value.map(item => inferType(item))

      // If all items have the same type, use that type
      const firstType = itemSchemas[0]
      const allSameType = itemSchemas.every(schema =>
        JSON.stringify(schema) === JSON.stringify(firstType)
      )

      if (allSameType) {
        return { type: 'array', items: firstType }
      } else {
        // Mixed types - use oneOf
        return {
          type: 'array',
          items: {
            oneOf: itemSchemas.filter((schema, index, self) =>
              self.findIndex(s => JSON.stringify(s) === JSON.stringify(schema)) === index
            )
          }
        }
      }
    }

    if (typeof value === 'object') {
      const properties: Record<string, any> = {}
      const required: string[] = []

      for (const [key, val] of Object.entries(value)) {
        properties[key] = inferType(val)
        if (includeRequired && val !== null && val !== undefined) {
          required.push(key)
        }
      }

      const schema: any = {
        type: 'object',
        properties
      }

      if (includeRequired && required.length > 0) {
        schema.required = required
      }

      return schema
    }

    if (typeof value === 'string') {
      return { type: 'string' }
    }

    if (typeof value === 'number') {
      return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' }
    }

    if (typeof value === 'boolean') {
      return { type: 'boolean' }
    }

    return {}
  }

  const generateSchema = () => {
    try {
      setError('')

      if (!input.trim()) {
        setError(t('jsonSchema.emptyInput'))
        setOutput('')
        return
      }

      const parsed = JSON.parse(input)
      const schema: any = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        ...inferType(parsed)
      }

      if (includeDescriptions) {
        schema.description = 'Auto-generated JSON Schema'
      }

      setOutput(JSON.stringify(schema, null, 2))
    } catch (err) {
      setError(t('jsonSchema.invalidJSON') + ': ' + (err as Error).message)
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
      title={t('tool.jsonSchema')}
      description={t('jsonSchema.description')}
    >
      <div className="space-y-4">
        {/* Options */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {t('jsonSchema.options')}
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="include-required"
              checked={includeRequired}
              onChange={(e) => setIncludeRequired(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="include-required" className="text-sm text-gray-700 dark:text-gray-300">
              {t('jsonSchema.includeRequired')}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="include-descriptions"
              checked={includeDescriptions}
              onChange={(e) => setIncludeDescriptions(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="include-descriptions" className="text-sm text-gray-700 dark:text-gray-300">
              {t('jsonSchema.includeDescriptions')}
            </label>
          </div>
        </div>

        {/* Input */}
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('jsonSchema.inputJSON')}
          placeholder={t('jsonSchema.placeholder')}
          rows={10}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={generateSchema}
            className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            {t('jsonSchema.generate')}
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            {t('common.clear')}
          </button>
        </div>

        {/* Output */}
        {output && (
          <TextAreaWithCopy
            value={output}
            readOnly
            label={t('jsonSchema.outputSchema')}
            rows={15}
          />
        )}

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {t('jsonSchema.infoTitle')}
          </h3>
          <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>{t('jsonSchema.info1')}</li>
            <li>{t('jsonSchema.info2')}</li>
            <li>{t('jsonSchema.info3')}</li>
            <li>{t('jsonSchema.info4')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
