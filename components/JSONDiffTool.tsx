'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function JSONDiffTool() {
  const { t } = useLanguage()
  // 두 JSON과 결과/에러 상태를 관리합니다.
  const [json1, setJson1] = useState('')
  const [json2, setJson2] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const compareDiff = () => {
    try {
      setError('')
      const obj1 = JSON.parse(json1)
      const obj2 = JSON.parse(json2)

      const differences: string[] = []

      const compareObjects = (o1: any, o2: any, path: string = '') => {
        if (typeof o1 !== typeof o2) {
          differences.push(
            t('jsonDiff.diff.typeMismatch', { path, type1: typeof o1, type2: typeof o2 })
          )
          return
        }

        if (typeof o1 !== 'object' || o1 === null) {
          if (o1 !== o2) {
            differences.push(
              t('jsonDiff.diff.changed', { path, from: JSON.stringify(o1), to: JSON.stringify(o2) })
            )
          }
          return
        }

        const keys1 = Object.keys(o1)
        const keys2 = Object.keys(o2)

        // Check for added keys
        keys2.forEach(key => {
          if (!keys1.includes(key)) {
            const currentPath = path ? `${path}.${key}` : key
            differences.push(t('jsonDiff.diff.added', { path: currentPath }))
          }
        })

        // Check for removed or changed keys
        keys1.forEach(key => {
          if (!keys2.includes(key)) {
            const currentPath = path ? `${path}.${key}` : key
            differences.push(t('jsonDiff.diff.removed', { path: currentPath }))
          } else {
            compareObjects(o1[key], o2[key], path ? `${path}.${key}` : key)
          }
        })
      }

      compareObjects(obj1, obj2)

      if (differences.length === 0) {
        setResult(t('jsonDiff.result.same'))
      } else {
        setResult(`${t('jsonDiff.result.diff', { count: differences.length })}\n\n${differences.join('\n')}`)
      }
    } catch (err: any) {
      setError(t('jsonDiff.error.compare', { message: err.message }))
      setResult('')
    }
  }

  return (
    <ToolCard
      title={`🔍 ${t('jsonDiff.title')}`}
      description={t('jsonDiff.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={json1}
          onChange={setJson1}
          label={t('jsonDiff.json1.label')}
          placeholder='{"name":"John","age":30}'
        />

        <TextAreaWithCopy
          value={json2}
          onChange={setJson2}
          label={t('jsonDiff.json2.label')}
          placeholder='{"name":"John","age":31}'
        />

        <button
          onClick={compareDiff}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('jsonDiff.actions.compare')}
        </button>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {result && (
          <TextAreaWithCopy
            value={result}
            readOnly
            label={t('jsonDiff.result.label')}
          />
        )}
      </div>
    </ToolCard>
  )
}
