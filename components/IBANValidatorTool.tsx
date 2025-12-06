'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { isValidIBAN, electronicFormatIBAN, friendlyFormatIBAN, extractIBAN } from 'ibantools'

export default function IBANValidatorTool() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const validateIBAN = () => {
    setError('')
    setResult('')

    try {
      if (!input.trim()) {
        setError('IBAN을 입력해주세요')
        return
      }

      const iban = input.trim()
      const valid = isValidIBAN(iban)

      if (valid) {
        const electronic = electronicFormatIBAN(iban)
        const friendly = friendlyFormatIBAN(iban)
        const countryCode = iban.substring(0, 2)
        const checkDigits = iban.substring(2, 4)
        const bban = iban.substring(4)

        const info = {
          '유효성': '✅ 유효한 IBAN입니다',
          '원본': iban,
          '전자 형식': electronic || '',
          '읽기 쉬운 형식': friendly || '',
          '국가 코드': countryCode,
          '체크 디지트': checkDigits,
          'BBAN': bban,
        }

        setResult(Object.entries(info).map(([key, value]) => `${key}: ${value}`).join('\n'))
      } else {
        setResult('❌ 유효하지 않은 IBAN입니다')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'IBAN 검증 중 오류가 발생했습니다')
    }
  }

  const formatElectronic = () => {
    setError('')
    setResult('')

    try {
      if (!input.trim()) {
        setError('IBAN을 입력해주세요')
        return
      }

      const formatted = electronicFormatIBAN(input.trim())
      if (formatted) {
        setResult(formatted)
      } else {
        setError('IBAN 포맷팅에 실패했습니다')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '포맷팅 중 오류가 발생했습니다')
    }
  }

  const formatFriendly = () => {
    setError('')
    setResult('')

    try {
      if (!input.trim()) {
        setError('IBAN을 입력해주세요')
        return
      }

      const formatted = friendlyFormatIBAN(input.trim())
      if (formatted) {
        setResult(formatted)
      } else {
        setError('IBAN 포맷팅에 실패했습니다')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '포맷팅 중 오류가 발생했습니다')
    }
  }

  const extractFromText = () => {
    setError('')
    setResult('')

    try {
      if (!input.trim()) {
        setError('텍스트를 입력해주세요')
        return
      }

      const extracted = extractIBAN(input)
      if (extracted && extracted.iban) {
        setResult(`추출된 IBAN: ${extracted.iban}`)
      } else {
        setResult('텍스트에서 IBAN을 찾을 수 없습니다')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'IBAN 추출 중 오류가 발생했습니다')
    }
  }


  return (
    <ToolCard
      title="IBAN Validator & Parser"
      description="국제 은행 계좌 번호(IBAN)를 검증하고 포맷팅합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            IBAN 입력
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="GB82 WEST 1234 5698 7654 32"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <button
            onClick={validateIBAN}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            ✅ 검증
          </button>
          <button
            onClick={formatElectronic}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            📱 전자 형식
          </button>
          <button
            onClick={formatFriendly}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            👁️ 읽기 쉽게
          </button>
          <button
            onClick={extractFromText}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            🔍 텍스트에서 추출
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <TextAreaWithCopy
          value={result}
          readOnly
          label="결과"
          rows={8}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 사용 예시</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• 독일: DE89 3704 0044 0532 0130 00</li>
            <li>• 영국: GB82 WEST 1234 5698 7654 32</li>
            <li>• 프랑스: FR14 2004 1010 0505 0001 3M02 606</li>
            <li>• 이탈리아: IT60 X054 2811 1010 0000 0123 456</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
