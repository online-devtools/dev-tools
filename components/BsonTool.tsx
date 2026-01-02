'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import ToolSchemas from './ToolSchemas'

// Simple BSON-like encoder/decoder (simulates MongoDB Extended JSON)
// Real BSON is binary, but we use Extended JSON format for web compatibility

interface ObjectId {
  $oid: string
}

interface BsonDate {
  $date: string | { $numberLong: string }
}

interface BsonTimestamp {
  $timestamp: { t: number; i: number }
}

interface BsonRegex {
  $regularExpression: { pattern: string; options: string }
}

interface BsonBinary {
  $binary: { base64: string; subType: string }
}

function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0')
  const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0')
  const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')
  const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0')
  return timestamp + machineId + processId + counter
}

function parseObjectId(oid: string): { timestamp: Date; machineId: string; processId: number; counter: number } | null {
  if (!/^[0-9a-fA-F]{24}$/.test(oid)) return null

  const timestamp = new Date(parseInt(oid.substring(0, 8), 16) * 1000)
  const machineId = oid.substring(8, 14)
  const processId = parseInt(oid.substring(14, 18), 16)
  const counter = parseInt(oid.substring(18, 24), 16)

  return { timestamp, machineId, processId, counter }
}

function jsonToExtendedJson(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj

  if (Array.isArray(obj)) {
    return obj.map(jsonToExtendedJson)
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (key === '_id' && typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value)) {
        result[key] = { $oid: value }
      } else if (value instanceof Date) {
        result[key] = { $date: value.toISOString() }
      } else if (typeof value === 'object' && value !== null) {
        result[key] = jsonToExtendedJson(value)
      } else {
        result[key] = value
      }
    }
    return result
  }

  return obj
}

function extendedJsonToJson(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj

  if (Array.isArray(obj)) {
    return obj.map(extendedJsonToJson)
  }

  if (typeof obj === 'object') {
    const o = obj as Record<string, unknown>

    // Handle $oid
    if ('$oid' in o && typeof o.$oid === 'string') {
      return o.$oid
    }

    // Handle $date
    if ('$date' in o) {
      const date = o.$date
      if (typeof date === 'string') {
        return new Date(date).toISOString()
      }
      if (typeof date === 'object' && date !== null && '$numberLong' in (date as Record<string, unknown>)) {
        return new Date(parseInt((date as { $numberLong: string }).$numberLong)).toISOString()
      }
    }

    // Handle $numberLong
    if ('$numberLong' in o && typeof o.$numberLong === 'string') {
      return parseInt(o.$numberLong)
    }

    // Handle $numberDouble
    if ('$numberDouble' in o && typeof o.$numberDouble === 'string') {
      return parseFloat(o.$numberDouble)
    }

    // Handle $binary
    if ('$binary' in o) {
      return `[Binary: ${(o.$binary as BsonBinary['$binary']).subType}]`
    }

    // Handle $timestamp
    if ('$timestamp' in o) {
      const ts = o.$timestamp as BsonTimestamp['$timestamp']
      return `Timestamp(${ts.t}, ${ts.i})`
    }

    // Handle $regularExpression
    if ('$regularExpression' in o) {
      const regex = o.$regularExpression as BsonRegex['$regularExpression']
      return `/${regex.pattern}/${regex.options}`
    }

    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(o)) {
      result[key] = extendedJsonToJson(value)
    }
    return result
  }

  return obj
}

export default function BsonTool() {
  const { t } = useLanguage()
  const [jsonInput, setJsonInput] = useState('')
  const [extendedJsonOutput, setExtendedJsonOutput] = useState('')
  const [objectIdInput, setObjectIdInput] = useState('')
  const [objectIdInfo, setObjectIdInfo] = useState<string>('')
  const [error, setError] = useState('')

  const handleJsonToExtended = () => {
    try {
      setError('')
      if (!jsonInput.trim()) {
        setError(t('bson.error.empty'))
        return
      }
      const parsed = JSON.parse(jsonInput)
      const extended = jsonToExtendedJson(parsed)
      setExtendedJsonOutput(JSON.stringify(extended, null, 2))
    } catch (e) {
      setError(t('bson.error.invalidJson'))
    }
  }

  const handleExtendedToJson = () => {
    try {
      setError('')
      if (!extendedJsonOutput.trim()) {
        setError(t('bson.error.empty'))
        return
      }
      const parsed = JSON.parse(extendedJsonOutput)
      const simplified = extendedJsonToJson(parsed)
      setJsonInput(JSON.stringify(simplified, null, 2))
    } catch (e) {
      setError(t('bson.error.invalidExtended'))
    }
  }

  const handleGenerateObjectId = () => {
    const oid = generateObjectId()
    setObjectIdInput(oid)
    parseAndDisplayObjectId(oid)
  }

  const handleParseObjectId = () => {
    parseAndDisplayObjectId(objectIdInput)
  }

  const parseAndDisplayObjectId = (oid: string) => {
    setError('')
    const info = parseObjectId(oid.trim())
    if (!info) {
      setError(t('bson.error.invalidObjectId'))
      setObjectIdInfo('')
      return
    }
    setObjectIdInfo(
      `${t('bson.objectId.timestamp')}: ${info.timestamp.toISOString()}\n` +
      `${t('bson.objectId.machineId')}: ${info.machineId}\n` +
      `${t('bson.objectId.processId')}: ${info.processId}\n` +
      `${t('bson.objectId.counter')}: ${info.counter}`
    )
  }

  const loadSample = () => {
    const sample = {
      _id: generateObjectId(),
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      createdAt: new Date().toISOString(),
      tags: ["developer", "mongodb"],
      profile: {
        bio: "Software Engineer",
        website: "https://example.com"
      }
    }
    setJsonInput(JSON.stringify(sample, null, 2))
    setError('')
  }

  const handleClear = () => {
    setJsonInput('')
    setExtendedJsonOutput('')
    setObjectIdInput('')
    setObjectIdInfo('')
    setError('')
  }

  return (
    <>
    <ToolSchemas toolKey="bson" toolPath="/bson" categoryKey="category.converters" categoryType="converter" />
    <ToolCard
      title={t('bson.title')}
      description={t('bson.description')}
    >
      <div className="space-y-6">
        {/* JSON to Extended JSON Section */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <TextAreaWithCopy
              value={jsonInput}
              onChange={setJsonInput}
              placeholder={t('bson.json.placeholder')}
              label={t('bson.json.label')}
              rows={10}
            />
          </div>
          <div>
            <TextAreaWithCopy
              value={extendedJsonOutput}
              onChange={setExtendedJsonOutput}
              placeholder={t('bson.extended.placeholder')}
              label={t('bson.extended.label')}
              rows={10}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleJsonToExtended}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {t('bson.actions.toExtended')} →
          </button>
          <button
            onClick={handleExtendedToJson}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            ← {t('bson.actions.toJson')}
          </button>
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            {t('bson.actions.sample')}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            {t('bson.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
            {error}
          </div>
        )}

        {/* ObjectId Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {t('bson.objectId.title')}
          </h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={objectIdInput}
                onChange={(e) => setObjectIdInput(e.target.value)}
                placeholder={t('bson.objectId.placeholder')}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
              />
              <button
                onClick={handleGenerateObjectId}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors whitespace-nowrap"
              >
                {t('bson.objectId.generate')}
              </button>
              <button
                onClick={handleParseObjectId}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors whitespace-nowrap"
              >
                {t('bson.objectId.parse')}
              </button>
            </div>

            {objectIdInfo && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded font-mono text-sm whitespace-pre-wrap">
                {objectIdInfo}
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            {t('bson.info.title')}
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• {t('bson.info.item1')}</li>
            <li>• {t('bson.info.item2')}</li>
            <li>• {t('bson.info.item3')}</li>
            <li>• {t('bson.info.item4')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
    </>
  )
}
