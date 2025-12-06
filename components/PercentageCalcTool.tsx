'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'

export default function PercentageCalcTool() {
  const [value, setValue] = useState('')
  const [percentage, setPercentage] = useState('')
  const [oldValue, setOldValue] = useState('')
  const [newValue, setNewValue] = useState('')

  const result1 = value && percentage ? ((parseFloat(value) * parseFloat(percentage)) / 100).toFixed(2) : ''
  const result2 = value && percentage ? (parseFloat(value) * (1 + parseFloat(percentage) / 100)).toFixed(2) : ''
  const result3 = value && percentage ? (parseFloat(value) * (1 - parseFloat(percentage) / 100)).toFixed(2) : ''
  const change = oldValue && newValue ? (((parseFloat(newValue) - parseFloat(oldValue)) / parseFloat(oldValue)) * 100).toFixed(2) : ''

  return (
    <ToolCard
      title="Percentage Calculator"
      description="다양한 퍼센트 계산을 수행합니다"
    >
      <div className="space-y-6">
        {/* X의 Y% 계산 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">X의 Y% 계산</h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="값"
            />
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="%"
            />
          </div>
          {result1 && (
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">{value}의 {percentage}%는</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{result1}</div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">{value} + {percentage}%는</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{result2}</div>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">{value} - {percentage}%는</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{result3}</div>
              </div>
            </div>
          )}
        </div>

        {/* 증감율 계산 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">증감율 계산</h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input
              type="number"
              value={oldValue}
              onChange={(e) => setOldValue(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="이전 값"
            />
            <input
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="새 값"
            />
          </div>
          {change && (
            <div className={`p-3 rounded-lg ${parseFloat(change) >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">변화율</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {parseFloat(change) >= 0 ? '+' : ''}{change}%
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  )
}
