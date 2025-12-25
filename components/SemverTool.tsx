'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { compareSemver, SemverError, sortSemverList } from '@/utils/semver'

type SortOrder = 'asc' | 'desc'

export default function SemverTool() {
  const { t } = useLanguage()
  // Comparison inputs and outputs are stored separately from list sorting to keep UX clear.
  const [leftVersion, setLeftVersion] = useState('')
  const [rightVersion, setRightVersion] = useState('')
  const [compareResult, setCompareResult] = useState('')
  const [compareError, setCompareError] = useState('')

  const [listInput, setListInput] = useState('')
  const [listOutput, setListOutput] = useState('')
  const [listError, setListError] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const formatError = (err: unknown): string => {
    if (err instanceof SemverError) {
      if (err.code === 'empty') {
        return t('semver.error.empty')
      }
      if (err.code === 'invalid') {
        return t('semver.error.invalid')
      }
    }
    return t('semver.error.unknown')
  }

  const handleCompare = () => {
    try {
      setCompareError('')
      // Compare follows SemVer precedence rules: major/minor/patch, then prerelease ordering.
      const result = compareSemver(leftVersion, rightVersion)

      if (result === 0) {
        setCompareResult(t('semver.compare.equal'))
      } else if (result > 0) {
        setCompareResult(t('semver.compare.leftGreater'))
      } else {
        setCompareResult(t('semver.compare.rightGreater'))
      }
    } catch (err) {
      setCompareError(formatError(err))
      setCompareResult('')
    }
  }

  const handleSort = (order: SortOrder) => {
    try {
      setListError('')
      // Split and trim lines so blank rows do not interfere with version sorting.
      setSortOrder(order)

      const lines = listInput.split('\n').map((line) => line.trim()).filter(Boolean)
      const sorted = sortSemverList(lines)
      const finalList = order === 'desc' ? sorted.reverse() : sorted

      setListOutput(finalList.join('\n'))
    } catch (err) {
      setListError(formatError(err))
      setListOutput('')
    }
  }

  const handleClear = () => {
    setLeftVersion('')
    setRightVersion('')
    setCompareResult('')
    setCompareError('')
    setListInput('')
    setListOutput('')
    setListError('')
    setSortOrder('asc')
  }

  return (
    <ToolCard
      title={`🔢 ${t('semver.title')}`}
      description={t('semver.description')}
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('semver.compare.title')}
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              value={leftVersion}
              onChange={(e) => setLeftVersion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
              placeholder={t('semver.compare.leftPlaceholder')}
            />
            <input
              type="text"
              value={rightVersion}
              onChange={(e) => setRightVersion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
              placeholder={t('semver.compare.rightPlaceholder')}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCompare}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              {t('semver.compare.action')}
            </button>
            <button
              onClick={handleClear}
              className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              {t('semver.actions.clear')}
            </button>
          </div>

          {compareError && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
              {compareError}
            </div>
          )}

          {compareResult && !compareError && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-200 rounded-lg text-sm">
              {compareResult}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('semver.sort.title')}
          </h3>

          <TextAreaWithCopy
            value={listInput}
            onChange={setListInput}
            label={t('semver.sort.inputLabel')}
            placeholder={t('semver.sort.placeholder')}
            rows={8}
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleSort('asc')}
              className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                sortOrder === 'asc'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t('semver.sort.asc')}
            </button>
            <button
              onClick={() => handleSort('desc')}
              className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                sortOrder === 'desc'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t('semver.sort.desc')}
            </button>
          </div>

          {listError && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
              {listError}
            </div>
          )}

          <TextAreaWithCopy
            value={listOutput}
            readOnly
            label={t('semver.sort.outputLabel')}
            placeholder={t('semver.sort.outputPlaceholder')}
            rows={8}
          />
        </div>
      </div>
    </ToolCard>
  )
}
