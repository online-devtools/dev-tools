'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'

export default function TempConverterTool() {
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('C')

  const convert = (val: number, from: string) => {
    let celsius: number
    switch (from) {
      case 'C':
        celsius = val
        break
      case 'F':
        celsius = (val - 32) * 5 / 9
        break
      case 'K':
        celsius = val - 273.15
        break
      case 'R':
        celsius = (val - 491.67) * 5 / 9
        break
      default:
        celsius = val
    }

    return {
      C: celsius,
      F: celsius * 9 / 5 + 32,
      K: celsius + 273.15,
      R: celsius * 9 / 5 + 491.67,
    }
  }

  const num = parseFloat(value)
  const results = !isNaN(num) ? convert(num, fromUnit) : null

  return (
    <ToolCard
      title="Temperature Converter"
      description="다양한 온도 단위를 변환합니다"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              값
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="100"
              step="any"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              단위
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="C">섭씨 (°C)</option>
              <option value="F">화씨 (°F)</option>
              <option value="K">켈빈 (K)</option>
              <option value="R">랭킨 (°R)</option>
            </select>
          </div>
        </div>

        {results && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">섭씨</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.C.toFixed(2)} °C
              </div>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">화씨</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.F.toFixed(2)} °F
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">켈빈</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.K.toFixed(2)} K
              </div>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">랭킨</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.R.toFixed(2)} °R
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">주요 온도</h3>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <div>• 물의 빙점: 0°C = 32°F = 273.15K</div>
            <div>• 물의 끓는점: 100°C = 212°F = 373.15K</div>
            <div>• 절대영도: -273.15°C = -459.67°F = 0K</div>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
