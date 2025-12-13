'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

interface Column {
  id: number
  name: string
}

interface WhereClause {
  id: number
  column: string
  operator: string
  value: string
  logic: 'AND' | 'OR'
}

export default function SQLBuilderTool() {
  const { t } = useLanguage()
  const [tableName, setTableName] = useState('users')
  const [columns, setColumns] = useState<Column[]>([
    { id: 1, name: 'id' },
    { id: 2, name: 'name' },
  ])
  const [whereClauses, setWhereClauses] = useState<WhereClause[]>([])
  const [orderBy, setOrderBy] = useState('')
  const [orderDirection, setOrderDirection] = useState<'ASC' | 'DESC'>('ASC')
  const [limit, setLimit] = useState('')
  const [nextColumnId, setNextColumnId] = useState(3)
  const [nextWhereId, setNextWhereId] = useState(1)

  const addColumn = () => {
    setColumns([...columns, { id: nextColumnId, name: '' }])
    setNextColumnId(nextColumnId + 1)
  }

  const removeColumn = (id: number) => {
    if (columns.length <= 1) return
    setColumns(columns.filter(c => c.id !== id))
  }

  const updateColumn = (id: number, name: string) => {
    setColumns(columns.map(c => (c.id === id ? { ...c, name } : c)))
  }

  const addWhereClause = () => {
    setWhereClauses([
      ...whereClauses,
      { id: nextWhereId, column: '', operator: '=', value: '', logic: 'AND' }
    ])
    setNextWhereId(nextWhereId + 1)
  }

  const removeWhereClause = (id: number) => {
    setWhereClauses(whereClauses.filter(w => w.id !== id))
  }

  const updateWhereClause = (id: number, updates: Partial<WhereClause>) => {
    setWhereClauses(whereClauses.map(w => (w.id === id ? { ...w, ...updates } : w)))
  }

  const generateSQL = () => {
    // SELECT
    const selectCols = columns.filter(c => c.name.trim()).map(c => c.name.trim())
    if (selectCols.length === 0) {
      selectCols.push('*')
    }

    let sql = `SELECT ${selectCols.join(', ')}\n`
    sql += `FROM ${tableName}`

    // WHERE
    const validWhere = whereClauses.filter(w => w.column.trim() && w.value.trim())
    if (validWhere.length > 0) {
      sql += '\nWHERE '
      sql += validWhere.map((w, index) => {
        const clause = `${w.column} ${w.operator} '${w.value}'`
        return index === 0 ? clause : `  ${w.logic} ${clause}`
      }).join('\n')
    }

    // ORDER BY
    if (orderBy.trim()) {
      sql += `\nORDER BY ${orderBy} ${orderDirection}`
    }

    // LIMIT
    if (limit.trim() && !isNaN(parseInt(limit))) {
      sql += `\nLIMIT ${limit}`
    }

    sql += ';'

    return sql
  }

  return (
    <ToolCard
      title={t('sqlBuilder.title')}
      description={t('sqlBuilder.description')}
    >
      <div className="space-y-6">
        {/* Table Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('sqlBuilder.tableName')}
          </label>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono"
            placeholder="table_name"
          />
        </div>

        {/* SELECT Columns */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('sqlBuilder.selectColumns')}
            </label>
            <button
              onClick={addColumn}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + {t('sqlBuilder.addColumn')}
            </button>
          </div>
          <div className="space-y-2">
            {columns.map((column) => (
              <div key={column.id} className="flex gap-2">
                <input
                  type="text"
                  value={column.name}
                  onChange={(e) => updateColumn(column.id, e.target.value)}
                  placeholder={t('sqlBuilder.columnPlaceholder')}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-sm"
                />
                <button
                  onClick={() => removeColumn(column.id)}
                  disabled={columns.length <= 1}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {t('sqlBuilder.selectHint')}
          </p>
        </div>

        {/* WHERE Clauses */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('sqlBuilder.whereConditions')}
            </label>
            <button
              onClick={addWhereClause}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              + {t('sqlBuilder.addCondition')}
            </button>
          </div>
          {whereClauses.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              {t('sqlBuilder.noConditions')}
            </p>
          ) : (
            <div className="space-y-2">
              {whereClauses.map((clause, index) => (
                <div key={clause.id} className="flex gap-2 items-center">
                  {index > 0 && (
                    <select
                      value={clause.logic}
                      onChange={(e) => updateWhereClause(clause.id, { logic: e.target.value as 'AND' | 'OR' })}
                      className="px-2 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                  )}
                  <input
                    type="text"
                    value={clause.column}
                    onChange={(e) => updateWhereClause(clause.id, { column: e.target.value })}
                    placeholder={t('sqlBuilder.columnName')}
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-sm"
                  />
                  <select
                    value={clause.operator}
                    onChange={(e) => updateWhereClause(clause.id, { operator: e.target.value })}
                    className="px-2 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm"
                  >
                    <option value="=">=</option>
                    <option value="!=">!=</option>
                    <option value=">">{'>'}</option>
                    <option value="<">{'<'}</option>
                    <option value=">=">{'>='}</option>
                    <option value="<=">{'<='}</option>
                    <option value="LIKE">LIKE</option>
                  </select>
                  <input
                    type="text"
                    value={clause.value}
                    onChange={(e) => updateWhereClause(clause.id, { value: e.target.value })}
                    placeholder={t('sqlBuilder.valuePlaceholder')}
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-sm"
                  />
                  <button
                    onClick={() => removeWhereClause(clause.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ORDER BY */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('sqlBuilder.orderBy')}
            </label>
            <input
              type="text"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              placeholder={t('sqlBuilder.orderByPlaceholder')}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('sqlBuilder.direction')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOrderDirection('ASC')}
                className={`px-4 py-2 rounded font-medium ${
                  orderDirection === 'ASC'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                ASC
              </button>
              <button
                onClick={() => setOrderDirection('DESC')}
                className={`px-4 py-2 rounded font-medium ${
                  orderDirection === 'DESC'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                DESC
              </button>
            </div>
          </div>
        </div>

        {/* LIMIT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('sqlBuilder.limit')}
          </label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="10"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono"
            min="1"
          />
        </div>

        {/* Generated SQL */}
        <TextAreaWithCopy
          value={generateSQL()}
          readOnly
          label={t('sqlBuilder.generatedSQL')}
          rows={10}
        />

        {/* Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            {t('sqlBuilder.infoTitle')}
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>{t('sqlBuilder.info1')}</li>
            <li>{t('sqlBuilder.info2')}</li>
            <li>{t('sqlBuilder.info3')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
