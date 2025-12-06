'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'

export default function RomanNumeralTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const toRoman = (num: number): string => {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    const numerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']

    let result = ''
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += numerals[i]
        num -= values[i]
      }
    }
    return result
  }

  const fromRoman = (str: string): number => {
    const values: { [key: string]: number } = {
      'I': 1, 'V': 5, 'X': 10, 'L': 50,
      'C': 100, 'D': 500, 'M': 1000
    }

    let result = 0
    for (let i = 0; i < str.length; i++) {
      const current = values[str[i]]
      const next = values[str[i + 1]]

      if (next && current < next) {
        result -= current
      } else {
        result += current
      }
    }
    return result
  }

  const convertToRoman = () => {
    try {
      setError('')
      const num = parseInt(input)
      if (isNaN(num) || num < 1 || num > 3999) {
        setError('1부터 3999 사이의 숫자를 입력해주세요.')
        setOutput('')
        return
      }
      setOutput(toRoman(num))
    } catch (err: any) {
      setError(`변환 오류: ${err.message}`)
      setOutput('')
    }
  }

  const convertFromRoman = () => {
    try {
      setError('')
      const upper = input.toUpperCase().trim()
      if (!/^[IVXLCDM]+$/.test(upper)) {
        setError('올바른 로마 숫자를 입력해주세요 (I, V, X, L, C, D, M).')
        setOutput('')
        return
      }
      setOutput(fromRoman(upper).toString())
    } catch (err: any) {
      setError(`변환 오류: ${err.message}`)
      setOutput('')
    }
  }

  return (
    <ToolCard
      title="Roman Numeral Converter"
      description="로마 숫자와 아라비아 숫자를 상호 변환합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            입력
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="123 또는 CXXIII"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={convertToRoman}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            숫자 → 로마
          </button>
          <button
            onClick={convertFromRoman}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            로마 → 숫자
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {output && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              {output}
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">로마 숫자 기호</h3>
          <div className="text-sm text-gray-700 dark:text-gray-300 grid grid-cols-2 gap-2">
            <div>I = 1</div>
            <div>V = 5</div>
            <div>X = 10</div>
            <div>L = 50</div>
            <div>C = 100</div>
            <div>D = 500</div>
            <div>M = 1000</div>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
