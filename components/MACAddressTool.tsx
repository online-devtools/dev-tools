'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MACAddressTool() {
  const { t } = useLanguage()
  // 생성/검증 대상 값과 옵션(개수, 구분자, 대문자 사용)을 상태로 관리합니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [count, setCount] = useState('1')
  const [separator, setSeparator] = useState(':')
  const [uppercase, setUppercase] = useState(true)

  const generateRandomMAC = (): string => {
    const hexDigits = '0123456789ABCDEF'
    let mac = ''

    // First octet should have the locally administered bit set (bit 1 of the first byte)
    // and unicast (bit 0 should be 0)
    const firstOctet = (Math.floor(Math.random() * 128) * 2) | 0x02
    mac = firstOctet.toString(16).padStart(2, '0')

    // Generate remaining 5 octets
    for (let i = 0; i < 5; i++) {
      const octet = Math.floor(Math.random() * 256)
      mac += octet.toString(16).padStart(2, '0')
    }

    return mac
  }

  const formatMAC = (mac: string, sep: string, upper: boolean): string => {
    const formatted = mac.match(/.{1,2}/g)?.join(sep) || mac
    return upper ? formatted.toUpperCase() : formatted.toLowerCase()
  }

  const generateMACs = () => {
    setError('')
    setOutput('')

    try {
      const numCount = parseInt(count, 10)

      if (isNaN(numCount) || numCount < 1 || numCount > 100) {
        setError(t('mac.error.count'))
        return
      }

      const macs = []
      for (let i = 0; i < numCount; i++) {
        const mac = generateRandomMAC()
        macs.push(formatMAC(mac, separator, uppercase))
      }

      setOutput(macs.join('\n'))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('mac.error.generate'))
    }
  }

  const normalizeMAC = (mac: string): string => {
    // Remove all separators and whitespace
    return mac.replace(/[:\-.\s]/g, '').toUpperCase()
  }

  const isValidMAC = (mac: string): boolean => {
    const normalized = normalizeMAC(mac)
    return /^[0-9A-F]{12}$/i.test(normalized)
  }

  const validateAndFormat = () => {
    setError('')
    setOutput('')

    try {
      if (!input.trim()) {
        setError(t('mac.error.required'))
        return
      }

      const lines = input.split('\n').filter(line => line.trim())
      const results = []

      for (const line of lines) {
        const mac = line.trim()

        if (!isValidMAC(mac)) {
          results.push(`❌ ${mac} - ${t('mac.error.invalid')}`)
          continue
        }

        const normalized = normalizeMAC(mac)
        const formats = {
          [t('mac.result.original')]: mac,
          [t('mac.result.normalized')]: normalized,
          [t('mac.result.colon')]: formatMAC(normalized, ':', uppercase),
          [t('mac.result.hyphen')]: formatMAC(normalized, '-', uppercase),
          [t('mac.result.dot')]: formatMAC(normalized, '.', uppercase),
          [t('mac.result.cisco')]: normalized.match(/.{1,4}/g)?.join('.') || normalized,
        }

        results.push(t('mac.result.validHeader'))
        results.push(Object.entries(formats).map(([key, value]) => `  ${key}: ${value}`).join('\n'))
        results.push('')
      }

      setOutput(results.join('\n'))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('mac.error.check'))
    }
  }

  const getVendorInfo = () => {
    setError('')
    setOutput('')

    if (!input.trim()) {
      setError(t('mac.error.required'))
      return
    }

    const mac = normalizeMAC(input.trim())

    if (!isValidMAC(mac)) {
      setError(t('mac.error.invalid'))
      return
    }

    const oui = mac.substring(0, 6)
    const nic = mac.substring(6)

    // Check if it's locally administered
    const firstByte = parseInt(mac.substring(0, 2), 16)
    const isLocallyAdministered = (firstByte & 0x02) !== 0
    const isUnicast = (firstByte & 0x01) === 0

    const info = {
      [t('mac.vendor.full')]: formatMAC(mac, ':', uppercase),
      [t('mac.vendor.oui')]: formatMAC(oui, ':', uppercase),
      [t('mac.vendor.nic')]: formatMAC(nic, ':', uppercase),
      [t('mac.vendor.local')]: isLocallyAdministered ? t('mac.vendor.boolean.yes') : t('mac.vendor.boolean.no'),
      [t('mac.vendor.unicast')]: isUnicast ? t('mac.vendor.unicast.yes') : t('mac.vendor.unicast.no'),
    }

    let result = Object.entries(info).map(([key, value]) => `${key}: ${value}`).join('\n')

    if (isLocallyAdministered) {
      result += `\n\n💡 ${t('mac.vendor.note.local')}`
    } else {
      result += `\n\n💡 ${t('mac.vendor.note.lookup')}`
    }

    setOutput(result)
  }

  return (
    <ToolCard
      title={`🖧 ${t('mac.title')}`}
      description={t('mac.description')}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('mac.count.label')}
            </label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('mac.separator.label')}
            </label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value=":">{t('mac.separator.colon')}</option>
              <option value="-">{t('mac.separator.hyphen')}</option>
              <option value=".">{t('mac.separator.dot')}</option>
              <option value="">{t('mac.separator.none')}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="uppercase"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="uppercase" className="text-sm text-gray-700 dark:text-gray-300">
            {t('mac.uppercase.label')}
          </label>
        </div>

        <button
          onClick={generateMACs}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          🎲 {t('mac.actions.generate')}
        </button>

        <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('mac.input.label')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('mac.input.placeholder')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={validateAndFormat}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            ✅ {t('mac.actions.validate')}
          </button>
          <button
            onClick={getVendorInfo}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            🏢 {t('mac.actions.vendor')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('mac.result.label')}
          rows={12}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 {t('mac.info.title')}</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• {t('mac.info.bullet1')}</li>
            <li>• {t('mac.info.bullet2')}</li>
            <li>• {t('mac.info.bullet3')}</li>
            <li>• {t('mac.info.bullet4')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
