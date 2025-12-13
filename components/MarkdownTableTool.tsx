'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type Alignment = 'left' | 'center' | 'right'

export default function MarkdownTableTool() {
  const { t } = useLanguage()
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [hasHeader, setHasHeader] = useState(true)
  const [alignments, setAlignments] = useState<Alignment[]>(Array(3).fill('left'))
  const [cells, setCells] = useState<string[][]>(
    Array(3).fill(null).map(() => Array(3).fill(''))
  )

  const updateDimensions = (newRows: number, newCols: number) => {
    const updatedCells = Array(newRows).fill(null).map((_, rowIndex) =>
      Array(newCols).fill(null).map((_, colIndex) =>
        cells[rowIndex]?.[colIndex] || ''
      )
    )
    const updatedAlignments = Array(newCols).fill(null).map((_, i) =>
      alignments[i] || 'left'
    )
    setCells(updatedCells)
    setAlignments(updatedAlignments)
    setRows(newRows)
    setCols(newCols)
  }

  const updateCell = (row: number, col: number, value: string) => {
    const newCells = [...cells]
    newCells[row][col] = value
    setCells(newCells)
  }

  const updateAlignment = (col: number, alignment: Alignment) => {
    const newAlignments = [...alignments]
    newAlignments[col] = alignment
    setAlignments(newAlignments)
  }

  const getAlignmentSymbol = (alignment: Alignment) => {
    switch (alignment) {
      case 'left': return ':---'
      case 'center': return ':---:'
      case 'right': return '---:'
    }
  }

  const generateMarkdown = () => {
    if (rows === 0 || cols === 0) return ''

    const lines: string[] = []
    const startRow = hasHeader ? 0 : 1

    // Header row
    if (hasHeader) {
      lines.push('| ' + cells[0].join(' | ') + ' |')
    } else {
      lines.push('| ' + Array(cols).fill('').map((_, i) => `Column ${i + 1}`).join(' | ') + ' |')
    }

    // Alignment row
    lines.push('| ' + alignments.map(getAlignmentSymbol).join(' | ') + ' |')

    // Data rows
    for (let i = startRow + (hasHeader ? 1 : 0); i < rows; i++) {
      lines.push('| ' + cells[i].join(' | ') + ' |')
    }

    return lines.join('\n')
  }

  const markdown = generateMarkdown()

  return (
    <ToolCard
      title={t('mdTable.title')}
      description={t('mdTable.description')}
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('mdTable.rows')}
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={rows}
              onChange={(e) => updateDimensions(parseInt(e.target.value) || 1, cols)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('mdTable.columns')}
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={cols}
              onChange={(e) => updateDimensions(rows, parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasHeader}
                onChange={(e) => setHasHeader(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('mdTable.hasHeader')}
              </span>
            </label>
          </div>
        </div>

        {/* Table Editor */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                {Array(cols).fill(null).map((_, colIndex) => (
                  <th key={colIndex} className="border border-gray-300 dark:border-gray-600 p-2">
                    <select
                      value={alignments[colIndex]}
                      onChange={(e) => updateAlignment(colIndex, e.target.value as Alignment)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                    >
                      <option value="left">← {t('mdTable.left')}</option>
                      <option value="center">↔ {t('mdTable.center')}</option>
                      <option value="right">→ {t('mdTable.right')}</option>
                    </select>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cells.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex === 0 && hasHeader ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="border border-gray-300 dark:border-gray-600 p-0">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                        placeholder={rowIndex === 0 && hasHeader ? t('mdTable.headerPlaceholder') : t('mdTable.cellPlaceholder')}
                        className="w-full px-2 py-2 border-0 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Generated Markdown */}
        <TextAreaWithCopy
          value={markdown}
          readOnly
          label={t('mdTable.output')}
          rows={8}
        />

        {/* Preview */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('mdTable.preview')}
          </h3>
          <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-x-auto">
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: markdownToHTML(markdown) }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {t('mdTable.infoTitle')}
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
            <li>{t('mdTable.info1')}</li>
            <li>{t('mdTable.info2')}</li>
            <li>{t('mdTable.info3')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}

// Simple markdown table to HTML converter
function markdownToHTML(markdown: string): string {
  if (!markdown) return ''

  const lines = markdown.split('\n').filter(line => line.trim())
  if (lines.length < 2) return ''

  let html = '<table class="min-w-full border-collapse border border-gray-300 dark:border-gray-600">'

  lines.forEach((line, index) => {
    if (index === 1) return // Skip alignment row

    const cells = line.split('|').filter(cell => cell.trim())
    const tag = index === 0 ? 'th' : 'td'
    const rowClass = index === 0 ? 'bg-gray-100 dark:bg-gray-700' : ''

    html += `<tr class="${rowClass}">`
    cells.forEach(cell => {
      html += `<${tag} class="border border-gray-300 dark:border-gray-600 px-4 py-2">${cell.trim()}</${tag}>`
    })
    html += '</tr>'
  })

  html += '</table>'
  return html
}
