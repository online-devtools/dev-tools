'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { parsePhoneNumber, isValidPhoneNumber, getCountryCallingCode, CountryCode } from 'libphonenumber-js'

export default function PhoneParserTool() {
  const [input, setInput] = useState('')
  const [country, setCountry] = useState<CountryCode>('KR')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const parsePhone = () => {
    setError('')
    setResult('')

    try {
      if (!input.trim()) {
        setError('전화번호를 입력해주세요')
        return
      }

      const phoneNumber = parsePhoneNumber(input, country)

      if (!phoneNumber) {
        setError('유효하지 않은 전화번호입니다')
        return
      }

      const info = {
        '원본 입력': input,
        '국제 형식 (E.164)': phoneNumber.number,
        '국제 형식 (포맷)': phoneNumber.formatInternational(),
        '국내 형식': phoneNumber.formatNational(),
        'URI 형식': phoneNumber.getURI(),
        '국가 코드': phoneNumber.country || '',
        '국가 번호': '+' + phoneNumber.countryCallingCode,
        '국내 번호': phoneNumber.nationalNumber,
        '유효성': isValidPhoneNumber(phoneNumber.number) ? '✅ 유효' : '❌ 유효하지 않음',
        '타입': phoneNumber.getType() || '알 수 없음',
        '가능 여부': phoneNumber.isPossible() ? '✅ 가능' : '❌ 불가능',
      }

      setResult(Object.entries(info).map(([key, value]) => `${key}: ${value}`).join('\n'))
    } catch (err) {
      setError(err instanceof Error ? err.message : '전화번호 파싱 중 오류가 발생했습니다')
    }
  }

  const validatePhone = () => {
    setError('')
    setResult('')

    try {
      if (!input.trim()) {
        setError('전화번호를 입력해주세요')
        return
      }

      const valid = isValidPhoneNumber(input, country)
      setResult(valid ? '✅ 유효한 전화번호입니다' : '❌ 유효하지 않은 전화번호입니다')
    } catch (err) {
      setError(err instanceof Error ? err.message : '전화번호 검증 중 오류가 발생했습니다')
    }
  }

  const formatPhone = (format: 'international' | 'national' | 'e164' | 'rfc3966') => {
    setError('')
    setResult('')

    try {
      if (!input.trim()) {
        setError('전화번호를 입력해주세요')
        return
      }

      const phoneNumber = parsePhoneNumber(input, country)

      if (!phoneNumber) {
        setError('유효하지 않은 전화번호입니다')
        return
      }

      let formatted = ''
      switch (format) {
        case 'international':
          formatted = phoneNumber.formatInternational()
          break
        case 'national':
          formatted = phoneNumber.formatNational()
          break
        case 'e164':
          formatted = phoneNumber.number
          break
        case 'rfc3966':
          formatted = phoneNumber.getURI()
          break
      }

      setResult(formatted)
    } catch (err) {
      setError(err instanceof Error ? err.message : '전화번호 포맷팅 중 오류가 발생했습니다')
    }
  }

  const countries: CountryCode[] = [
    'KR', 'US', 'JP', 'CN', 'GB', 'DE', 'FR', 'CA', 'AU', 'IN',
    'BR', 'MX', 'ES', 'IT', 'NL', 'SE', 'NO', 'DK', 'FI', 'PL'
  ]

  return (
    <ToolCard
      title="Phone Number Parser"
      description="전화번호를 파싱하고 검증하며 다양한 형식으로 포맷팅합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            기본 국가 코드
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as CountryCode)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {countries.map((code) => (
              <option key={code} value={code}>
                {code} (+{getCountryCallingCode(code)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            전화번호 입력
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="010-1234-5678 또는 +82 10 1234 5678"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <button
            onClick={parsePhone}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            📱 파싱
          </button>
          <button
            onClick={validatePhone}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            ✅ 검증
          </button>
          <button
            onClick={() => formatPhone('international')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            🌍 국제 형식
          </button>
          <button
            onClick={() => formatPhone('national')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            🏠 국내 형식
          </button>
          <button
            onClick={() => formatPhone('e164')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            📞 E.164
          </button>
          <button
            onClick={() => formatPhone('rfc3966')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            🔗 URI
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
          rows={12}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 사용 예시</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• 한국: 010-1234-5678, 01012345678, +82 10 1234 5678</li>
            <li>• 미국: (555) 123-4567, +1 555 123 4567</li>
            <li>• 일본: 090-1234-5678, +81 90 1234 5678</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
