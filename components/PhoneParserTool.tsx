'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { parsePhoneNumber, isValidPhoneNumber, getCountryCallingCode, CountryCode } from 'libphonenumber-js'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PhoneParserTool() {
  const { t } = useLanguage()
  // 입력, 국가 코드, 결과, 에러 메시지를 상태로 관리해 번역된 UI를 제공합니다.
  const [input, setInput] = useState('')
  const [country, setCountry] = useState<CountryCode>('KR')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const parsePhone = () => {
    setError('')
    setResult('')

    try {
      if (!input.trim()) {
        setError(t('phoneParser.error.required'))
        return
      }

      const phoneNumber = parsePhoneNumber(input, country)

      if (!phoneNumber) {
        setError(t('phoneParser.error.invalid'))
        return
      }

      const validity = isValidPhoneNumber(phoneNumber.number)
      const infoLines = [
        { key: 'phoneParser.info.original', value: input },
        { key: 'phoneParser.info.e164', value: phoneNumber.number },
        { key: 'phoneParser.info.international', value: phoneNumber.formatInternational() },
        { key: 'phoneParser.info.national', value: phoneNumber.formatNational() },
        { key: 'phoneParser.info.uri', value: phoneNumber.getURI() },
        { key: 'phoneParser.info.countryCode', value: phoneNumber.country || '' },
        { key: 'phoneParser.info.callingCode', value: `+${phoneNumber.countryCallingCode}` },
        { key: 'phoneParser.info.nationalNumber', value: phoneNumber.nationalNumber },
        { key: 'phoneParser.info.validity', value: t(validity ? 'phoneParser.info.valid' : 'phoneParser.info.invalid') },
        { key: 'phoneParser.info.type', value: phoneNumber.getType() || t('phoneParser.info.typeUnknown') },
        { key: 'phoneParser.info.possible', value: t(phoneNumber.isPossible() ? 'phoneParser.info.possible.yes' : 'phoneParser.info.possible.no') },
      ]

      setResult(infoLines.map(({ key, value }) => `${t(key)}: ${value}`).join('\n'))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('phoneParser.error.parse'))
    }
  }

  const validatePhone = () => {
    setError('')
    setResult('')

    try {
      if (!input.trim()) {
        setError(t('phoneParser.error.required'))
        return
      }

      const valid = isValidPhoneNumber(input, country)
      setResult(valid ? t('phoneParser.result.valid') : t('phoneParser.result.invalid'))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('phoneParser.error.validate'))
    }
  }

  const formatPhone = (format: 'international' | 'national' | 'e164' | 'rfc3966') => {
    setError('')
    setResult('')

    try {
      if (!input.trim()) {
        setError(t('phoneParser.error.required'))
        return
      }

      const phoneNumber = parsePhoneNumber(input, country)

      if (!phoneNumber) {
        setError(t('phoneParser.error.invalid'))
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
      setError(err instanceof Error ? err.message : t('phoneParser.error.format'))
    }
  }

  const countries: CountryCode[] = [
    'KR', 'US', 'JP', 'CN', 'GB', 'DE', 'FR', 'CA', 'AU', 'IN',
    'BR', 'MX', 'ES', 'IT', 'NL', 'SE', 'NO', 'DK', 'FI', 'PL'
  ]

  return (
    <ToolCard
      title={`📞 ${t('phoneParser.title')}`}
      description={t('phoneParser.description')}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('phoneParser.country.label')}
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
            {t('phoneParser.input.label')}
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('phoneParser.input.placeholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <button
            onClick={parsePhone}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            📱 {t('phoneParser.actions.parse')}
          </button>
          <button
            onClick={validatePhone}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            ✅ {t('phoneParser.actions.validate')}
          </button>
          <button
            onClick={() => formatPhone('international')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            🌍 {t('phoneParser.actions.international')}
          </button>
          <button
            onClick={() => formatPhone('national')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            🏠 {t('phoneParser.actions.national')}
          </button>
          <button
            onClick={() => formatPhone('e164')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            📞 {t('phoneParser.actions.e164')}
          </button>
          <button
            onClick={() => formatPhone('rfc3966')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            🔗 {t('phoneParser.actions.uri')}
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
          label={t('phoneParser.result.label')}
          rows={12}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 {t('phoneParser.examples.title')}</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• {t('phoneParser.examples.kr')}</li>
            <li>• {t('phoneParser.examples.us')}</li>
            <li>• {t('phoneParser.examples.jp')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
