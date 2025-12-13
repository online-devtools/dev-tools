'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SortTool() {
  const { t } = useLanguage()
  // 원본 텍스트와 정렬 결과, 옵션(정렬 모드, 정렬 순서, 공백/중복 처리)을 상태로 관리합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'alpha' | 'length' | 'numeric'>('alpha')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [trimLines, setTrimLines] = useState(true)
  const [removeEmpty, setRemoveEmpty] = useState(true)
  const [dedupe, setDedupe] = useState(true)
  const [caseSensitive, setCaseSensitive] = useState(false)

  // 정렬 옵션이 바뀔 때마다 결과를 즉시 갱신합니다.
  useMemo(() => {
    if (!input) {
      setOutput('')
      return
    }

    const lines = input.split('\n')
      .map(line => (trimLines ? line.trim() : line))
      .filter(line => (removeEmpty ? line !== '' : true))

    const keyFn = (value: string) => (caseSensitive ? value : value.toLowerCase())

    const comparator = (a: string, b: string) => {
      if (mode === 'length') {
        return a.length - b.length
      }
      if (mode === 'numeric') {
        const aNum = parseFloat(a)
        const bNum = parseFloat(b)
        // 숫자로 파싱되지 않으면 문자열 비교로 폴백합니다.
        if (isNaN(aNum) || isNaN(bNum)) {
          return keyFn(a).localeCompare(keyFn(b))
        }
        return aNum - bNum
      }
      return keyFn(a).localeCompare(keyFn(b))
    }

    const sorted = [...lines].sort((a, b) => order === 'asc' ? comparator(a, b) : -comparator(a, b))

    const finalLines = dedupe
      ? Array.from(new Map(sorted.map((line) => [keyFn(line), line])).values())
      : sorted

    setOutput(finalLines.join('\n'))
  }, [input, mode, order, trimLines, removeEmpty, dedupe, caseSensitive])

  return (
    <ToolCard
      title={`↕️ ${t('sorter.title')}`}
      description={t('sorter.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('sorter.input.label')}
          placeholder={t('sorter.input.placeholder')}
          rows={8}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t('sorter.options.mode')}</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMode('alpha')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'alpha'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {t('sorter.mode.alpha')}
              </button>
              <button
                onClick={() => setMode('length')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'length'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {t('sorter.mode.length')}
              </button>
              <button
                onClick={() => setMode('numeric')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'numeric'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {t('sorter.mode.numeric')}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t('sorter.options.order')}</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setOrder('asc')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  order === 'asc'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {t('sorter.order.asc')}
              </button>
              <button
                onClick={() => setOrder('desc')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  order === 'desc'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {t('sorter.order.desc')}
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              className="rounded"
            />
            {t('sorter.options.trim')}
          </label>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={removeEmpty}
              onChange={(e) => setRemoveEmpty(e.target.checked)}
              className="rounded"
            />
            {t('sorter.options.removeEmpty')}
          </label>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={dedupe}
              onChange={(e) => setDedupe(e.target.checked)}
              className="rounded"
            />
            {t('sorter.options.dedupe')}
          </label>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded"
            />
            {t('sorter.options.caseSensitive')}
          </label>
        </div>

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('sorter.output.label')}
          placeholder={t('sorter.output.placeholder')}
          rows={8}
        />
      </div>
    </ToolCard>
  )
}
