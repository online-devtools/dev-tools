'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type JsonSchema = {
  type?: string
  properties?: Record<string, JsonSchema>
  items?: JsonSchema
  enum?: any[]
  format?: string
  example?: any
  default?: any
}

function exampleFromSchema(schema: JsonSchema): any {
  // 매우 단순한 규칙으로 예시 데이터를 생성합니다.
  if (schema.example !== undefined) return schema.example
  if (schema.default !== undefined) return schema.default
  switch (schema.type) {
    case 'string':
      if (schema.enum?.length) return schema.enum[0]
      if (schema.format === 'email') return 'user@example.com'
      if (schema.format === 'date-time') return new Date().toISOString()
      return 'string'
    case 'integer':
    case 'number':
      return schema.enum?.[0] ?? 42
    case 'boolean':
      return true
    case 'array':
      return [exampleFromSchema(schema.items || {})]
    case 'object': {
      const obj: Record<string, any> = {}
      Object.entries(schema.properties || {}).forEach(([k, v]) => {
        obj[k] = exampleFromSchema(v)
      })
      return obj
    }
    default:
      return null
  }
}

function schemaToTs(schema: JsonSchema, name = 'Root'): string {
  // 재귀적으로 TypeScript 타입 문자열을 생성합니다.
  if (schema.type === 'object') {
    const props = Object.entries(schema.properties || {}).map(([key, val]) => {
      return `  ${key}: ${schemaToTs(val, key)};`
    })
    return `{\n${props.join('\n')}\n}`
  }
  if (schema.type === 'array') {
    return `${schemaToTs(schema.items || {}, name + 'Item')}[]`
  }
  if (schema.type === 'string') return 'string'
  if (schema.type === 'integer' || schema.type === 'number') return 'number'
  if (schema.type === 'boolean') return 'boolean'
  return 'any'
}

export default function SchemaMockTool() {
  const { t } = useLanguage()
  // 스키마 입력과 생성된 예시 JSON/타입 결과를 상태로 관리합니다.
  const [input, setInput] = useState('')
  const [mockJson, setMockJson] = useState('')
  const [tsType, setTsType] = useState('')
  const [error, setError] = useState('')

  const handleGenerate = () => {
    try {
      setError('')
      const schema = JSON.parse(input) as JsonSchema
      const example = exampleFromSchema(schema)
      setMockJson(JSON.stringify(example, null, 2))
      setTsType(schemaToTs(schema))
    } catch (e) {
      setError(t('schemaMock.error.parse', { message: e instanceof Error ? e.message : '' }))
      setMockJson('')
      setTsType('')
    }
  }

  return (
    <ToolCard
      title={`🧩 ${t('schemaMock.title')}`}
      description={t('schemaMock.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('schemaMock.input.label')}
          placeholder={t('schemaMock.input.placeholder')}
          rows={10}
        />

        <button
          onClick={handleGenerate}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('schemaMock.actions.generate')}
        </button>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={mockJson}
          readOnly
          label={t('schemaMock.output.json')}
          rows={8}
        />

        <TextAreaWithCopy
          value={tsType}
          readOnly
          label={t('schemaMock.output.ts')}
          rows={6}
        />
      </div>
    </ToolCard>
  )
}
