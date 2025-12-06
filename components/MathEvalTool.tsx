'use client'

import { useState } from 'react'
import { evaluate } from 'mathjs'
import ToolCard from './ToolCard'

export default function MathEvalTool() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const calculate = () => {
    try {
      setError('')
      const res = evaluate(expression)
      setResult(typeof res === 'number' ? res.toString() : JSON.stringify(res))
    } catch (err: any) {
      setError(`계산 오류: ${err.message}`)
      setResult('')
    }
  }

  return (
    <ToolCard
      title="Math Evaluator"
      description="수학 표현식을 평가하고 계산합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            수식 입력
          </label>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && calculate()}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
            placeholder="sqrt(16) + 2^3 * 5"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          계산
        </button>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">결과</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white font-mono">
              {result}
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">지원 함수</h3>
          <div className="text-sm text-gray-700 dark:text-gray-300 grid grid-cols-2 gap-1">
            <div>• sqrt(x) - 제곱근</div>
            <div>• abs(x) - 절댓값</div>
            <div>• sin(x), cos(x), tan(x)</div>
            <div>• log(x), exp(x)</div>
            <div>• round(x), ceil(x), floor(x)</div>
            <div>• pow(x, y) 또는 x^y</div>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
