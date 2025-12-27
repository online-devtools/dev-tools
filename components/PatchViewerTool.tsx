'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'
import { parseUnifiedDiff, PatchFile, PatchLine } from '@/utils/patchParser'

// Provide a small diff sample so users can preview the output quickly.
const sampleDiff = [
  'diff --git a/app.ts b/app.ts',
  'index 1111111..2222222 100644',
  '--- a/app.ts',
  '+++ b/app.ts',
  '@@ -1,3 +1,4 @@',
  ' const foo = 1',
  '-const bar = 2',
  '+const bar = 3',
  '+const baz = 4',
  ' console.log(foo)',
  'diff --git a/utils.ts b/utils.ts',
  '--- a/utils.ts',
  '+++ b/utils.ts',
  '@@ -5,2 +5,2 @@',
  '-export const sum = (a, b) => a + b',
  '+export const sum = (a, b) => a + b + 1',
  '',
].join('\n')

const formatLineNumber = (value: number | null): string => {
  // Keep columns aligned by rendering empty strings for missing line numbers.
  if (value === null) return ''
  return String(value).padStart(4, ' ')
}

const getLineStyle = (line: PatchLine): string => {
  // Apply visual emphasis based on diff line type.
  if (line.type === 'add') {
    return 'bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-200'
  }
  if (line.type === 'del') {
    return 'bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200'
  }
  if (line.type === 'meta') {
    return 'text-gray-500 dark:text-gray-400 italic'
  }
  return 'text-gray-700 dark:text-gray-200'
}

const FileHeader = ({ file }: { file: PatchFile }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
      <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
        {file.oldPath} → {file.newPath}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-300">
        +{file.additions} / -{file.deletions}
      </div>
    </div>
  )
}

export default function PatchViewerTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')

  const parseResult = useMemo(() => {
    return parseUnifiedDiff(input)
  }, [input])

  const handleLoadSample = () => {
    setInput(sampleDiff)
  }

  const handleClear = () => {
    setInput('')
  }

  return (
    <ToolCard
      title={`🩹 ${t('patchViewer.title')}`}
      description={t('patchViewer.description')}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('patchViewer.input.label')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('patchViewer.input.placeholder')}
            rows={12}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleLoadSample}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('patchViewer.actions.sample')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('patchViewer.actions.clear')}
          </button>
        </div>

        {parseResult.warnings.length > 0 && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900 dark:border-yellow-900/40 dark:bg-yellow-900/20 dark:text-yellow-200">
            {parseResult.warnings.map((warning) => (
              <div key={warning}>{warning}</div>
            ))}
          </div>
        )}

        {input.trim().length > 0 && parseResult.files.length === 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('patchViewer.empty')}
          </div>
        )}

        {parseResult.files.length > 0 && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {t('patchViewer.summary.files', { count: parseResult.files.length })}
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-700 dark:text-green-200">
                {t('patchViewer.summary.additions', { count: parseResult.additions })}
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-200">
                {t('patchViewer.summary.deletions', { count: parseResult.deletions })}
              </div>
            </div>

            <div className="space-y-6">
              {parseResult.files.map((file, fileIndex) => (
                <div key={`${file.oldPath}-${file.newPath}-${fileIndex}`} className="space-y-3">
                  <FileHeader file={file} />
                  {file.hunks.map((hunk, hunkIndex) => (
                    <div key={`${hunk.header}-${hunkIndex}`} className="space-y-2">
                      <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                        {hunk.header}
                      </div>
                      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        {hunk.lines.map((line, lineIndex) => (
                          <div
                            key={`${lineIndex}-${line.content}`}
                            className={`grid grid-cols-[3.5rem_3.5rem_1fr] gap-2 px-3 py-1 font-mono text-xs ${getLineStyle(line)}`}
                          >
                            <div className="text-right text-gray-500 dark:text-gray-400">
                              {formatLineNumber(line.oldLine)}
                            </div>
                            <div className="text-right text-gray-500 dark:text-gray-400">
                              {formatLineNumber(line.newLine)}
                            </div>
                            <div className="whitespace-pre-wrap">
                              {line.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
