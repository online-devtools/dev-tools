'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function JSONDiffTool() {
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
          differences.push(`${path}: 타입이 다릅니다 (${typeof o1} vs ${typeof o2})`)
          return
        }

        if (typeof o1 !== 'object' || o1 === null) {
          if (o1 !== o2) {
            differences.push(`${path}: ${JSON.stringify(o1)} → ${JSON.stringify(o2)}`)
          }
          return
        }

        const keys1 = Object.keys(o1)
        const keys2 = Object.keys(o2)

        // Check for added keys
        keys2.forEach(key => {
          if (!keys1.includes(key)) {
            differences.push(`${path}.${key}: 추가됨`)
          }
        })

        // Check for removed or changed keys
        keys1.forEach(key => {
          if (!keys2.includes(key)) {
            differences.push(`${path}.${key}: 삭제됨`)
          } else {
            compareObjects(o1[key], o2[key], path ? `${path}.${key}` : key)
          }
        })
      }

      compareObjects(obj1, obj2)

      if (differences.length === 0) {
        setResult('✅ 두 JSON이 동일합니다!')
      } else {
        setResult(`차이점 (${differences.length}개):\n\n` + differences.join('\n'))
      }
    } catch (err: any) {
      setError(`비교 오류: ${err.message}`)
      setResult('')
    }
  }

  return (
    <ToolCard
      title="JSON Diff"
      description="두 JSON 객체의 차이점을 비교합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={json1}
          onChange={setJson1}
          label="JSON 1"
          placeholder='{"name":"John","age":30}'
        />

        <TextAreaWithCopy
          value={json2}
          onChange={setJson2}
          label="JSON 2"
          placeholder='{"name":"John","age":31}'
        />

        <button
          onClick={compareDiff}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          비교
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
            label="비교 결과"
          />
        )}
      </div>
    </ToolCard>
  )
}
