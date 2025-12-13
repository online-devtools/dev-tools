'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type DataType = 'name' | 'email' | 'phone' | 'address' | 'company' | 'date' | 'number' | 'uuid' | 'lorem'
type OutputFormat = 'json' | 'csv' | 'sql'

interface Field {
  id: number
  name: string
  type: DataType
}

export default function MockDataTool() {
  const { t } = useLanguage()
  const [fields, setFields] = useState<Field[]>([
    { id: 1, name: 'name', type: 'name' },
    { id: 2, name: 'email', type: 'email' },
  ])
  const [nextId, setNextId] = useState(3)
  const [count, setCount] = useState(10)
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('json')
  const [tableName, setTableName] = useState('users')

  const addField = () => {
    setFields([...fields, { id: nextId, name: `field${nextId}`, type: 'name' }])
    setNextId(nextId + 1)
  }

  const removeField = (id: number) => {
    if (fields.length <= 1) return
    setFields(fields.filter(f => f.id !== id))
  }

  const updateField = (id: number, updates: Partial<Field>) => {
    setFields(fields.map(f => (f.id === id ? { ...f, ...updates } : f)))
  }

  // Simple mock data generators
  const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Emma', 'Frank', 'Grace', 'Henry']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
  const companies = ['Acme Corp', 'TechStart', 'DataFlow', 'CloudNine', 'DevTools Inc', 'CodeBase', 'NetWork Ltd', 'ByteSize', 'InfoSys', 'WebGen']
  const streets = ['Main St', 'Oak Ave', 'Park Rd', 'Maple Dr', 'Cedar Ln', 'Pine St', 'Elm Ave', 'Washington Blvd', 'Market St', 'Broadway']
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
  const loremWords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor']

  const generateValue = (type: DataType): string | number => {
    const random = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
    const randomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

    switch (type) {
      case 'name':
        return `${random(firstNames)} ${random(lastNames)}`
      case 'email':
        const first = random(firstNames).toLowerCase()
        const last = random(lastNames).toLowerCase()
        return `${first}.${last}@example.com`
      case 'phone':
        return `+1-${randomNum(200, 999)}-${randomNum(100, 999)}-${randomNum(1000, 9999)}`
      case 'address':
        return `${randomNum(1, 9999)} ${random(streets)}, ${random(cities)}`
      case 'company':
        return random(companies)
      case 'date':
        const year = randomNum(2020, 2024)
        const month = String(randomNum(1, 12)).padStart(2, '0')
        const day = String(randomNum(1, 28)).padStart(2, '0')
        return `${year}-${month}-${day}`
      case 'number':
        return randomNum(1, 10000)
      case 'uuid':
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0
          const v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
      case 'lorem':
        const wordCount = randomNum(3, 8)
        return Array.from({ length: wordCount }, () => random(loremWords)).join(' ')
      default:
        return ''
    }
  }

  const generateMockData = () => {
    const data = []
    for (let i = 0; i < count; i++) {
      const record: Record<string, string | number> = {}
      fields.forEach(field => {
        record[field.name] = generateValue(field.type)
      })
      data.push(record)
    }
    return data
  }

  const generateOutput = () => {
    const data = generateMockData()

    switch (outputFormat) {
      case 'json':
        return JSON.stringify(data, null, 2)

      case 'csv':
        const headers = fields.map(f => f.name).join(',')
        const rows = data.map(record =>
          fields.map(f => {
            const value = String(record[f.name])
            return value.includes(',') || value.includes('"') ? `"${value.replace(/"/g, '""')}"` : value
          }).join(',')
        )
        return [headers, ...rows].join('\n')

      case 'sql':
        const columns = fields.map(f => f.name).join(', ')
        const values = data.map(record => {
          const vals = fields.map(f => {
            const value = record[f.name]
            return typeof value === 'number' ? value : `'${String(value).replace(/'/g, "''")}'`
          }).join(', ')
          return `(${vals})`
        }).join(',\n  ')
        return `INSERT INTO ${tableName} (${columns})\nVALUES\n  ${values};`

      default:
        return ''
    }
  }

  return (
    <ToolCard
      title={t('mockData.title')}
      description={t('mockData.description')}
    >
      <div className="space-y-6">
        {/* Fields Configuration */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('mockData.fields')}
            </label>
            <button
              onClick={addField}
              disabled={fields.length >= 10}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              + {t('mockData.addField')}
            </button>
          </div>

          <div className="space-y-2">
            {fields.map((field) => (
              <div key={field.id} className="flex gap-2">
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => updateField(field.id, { name: e.target.value })}
                  placeholder={t('mockData.fieldName')}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
                />
                <select
                  value={field.type}
                  onChange={(e) => updateField(field.id, { type: e.target.value as DataType })}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
                >
                  <option value="name">{t('mockData.type.name')}</option>
                  <option value="email">{t('mockData.type.email')}</option>
                  <option value="phone">{t('mockData.type.phone')}</option>
                  <option value="address">{t('mockData.type.address')}</option>
                  <option value="company">{t('mockData.type.company')}</option>
                  <option value="date">{t('mockData.type.date')}</option>
                  <option value="number">{t('mockData.type.number')}</option>
                  <option value="uuid">{t('mockData.type.uuid')}</option>
                  <option value="lorem">{t('mockData.type.lorem')}</option>
                </select>
                <button
                  onClick={() => removeField(field.id)}
                  disabled={fields.length <= 1}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('mockData.count')}: {count}
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>1</span>
            <span>100</span>
          </div>
        </div>

        {/* Output Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('mockData.outputFormat')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['json', 'csv', 'sql'] as OutputFormat[]).map(format => (
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

        {/* Table Name (for SQL) */}
        {outputFormat === 'sql' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('mockData.tableName')}
            </label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"
            />
          </div>
        )}

        {/* Output */}
        <TextAreaWithCopy
          value={generateOutput()}
          readOnly
          label={t('mockData.output')}
          rows={15}
        />

        {/* Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            {t('mockData.infoTitle')}
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>{t('mockData.info1')}</li>
            <li>{t('mockData.info2')}</li>
            <li>{t('mockData.info3')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
