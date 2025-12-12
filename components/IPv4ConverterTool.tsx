'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function IPv4ConverterTool() {
  const { t } = useLanguage()
  // 입력 IP/숫자와 변환 결과, 에러 상태를 관리해 IPv4 포맷 변환 및 클래스 조회를 수행합니다.
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const isValidIPv4 = (ip: string): boolean => {
    const parts = ip.split('.')
    if (parts.length !== 4) return false

    return parts.every(part => {
      const num = parseInt(part, 10)
      return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString()
    })
  }

  const ipToDecimal = (ip: string): number => {
    const parts = ip.split('.').map(p => parseInt(p, 10))
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]
  }

  const decimalToIP = (decimal: number): string => {
    return [
      (decimal >>> 24) & 0xFF,
      (decimal >>> 16) & 0xFF,
      (decimal >>> 8) & 0xFF,
      decimal & 0xFF
    ].join('.')
  }

  const ipToBinary = (ip: string): string => {
    return ip.split('.').map(part => {
      return parseInt(part, 10).toString(2).padStart(8, '0')
    }).join('.')
  }

  const ipToHex = (ip: string): string => {
    return ip.split('.').map(part => {
      return parseInt(part, 10).toString(16).padStart(2, '0').toUpperCase()
    }).join('.')
  }

  const ipToOctal = (ip: string): string => {
    return ip.split('.').map(part => {
      return '0' + parseInt(part, 10).toString(8).padStart(3, '0')
    }).join('.')
  }

  const convertIP = () => {
    setError('')
    setResult('')

    try {
      const trimmed = input.trim()

      if (!trimmed) {
        setError(t('ipv4.error.required'))
        return
      }

      // Check if input is a valid IPv4 address
      if (isValidIPv4(trimmed)) {
        const decimal = ipToDecimal(trimmed)
        const binary = ipToBinary(trimmed)
        const hex = ipToHex(trimmed)
        const octal = ipToOctal(trimmed)

        const info = {
          [t('ipv4.result.original')]: trimmed,
          [t('ipv4.result.decimal')]: decimal.toString(),
          [t('ipv4.result.binary')]: binary,
          [t('ipv4.result.hex')]: hex,
          [t('ipv4.result.octal')]: octal,
          [t('ipv4.result.hexPrefixed')]: '0x' + trimmed.split('.').map(p => parseInt(p).toString(16).padStart(2, '0').toUpperCase()).join(''),
          [t('ipv4.result.integer')]: decimal.toString(),
        }

        setResult(Object.entries(info).map(([key, value]) => `${key}: ${value}`).join('\n'))
      }
      // Check if input is a decimal number
      else if (/^\d+$/.test(trimmed)) {
        const decimal = parseInt(trimmed, 10)
        if (decimal < 0 || decimal > 4294967295) {
          setError(t('ipv4.error.decRange'))
          return
        }

        const ip = decimalToIP(decimal)
        const binary = ipToBinary(ip)
        const hex = ipToHex(ip)
        const octal = ipToOctal(ip)

        const info = {
          [t('ipv4.result.decimal')]: trimmed,
          [t('ipv4.result.ip')]: ip,
          [t('ipv4.result.binary')]: binary,
          [t('ipv4.result.hex')]: hex,
          [t('ipv4.result.octal')]: octal,
        }

        setResult(Object.entries(info).map(([key, value]) => `${key}: ${value}`).join('\n'))
      }
      else {
        setError(t('ipv4.error.invalid'))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('ipv4.error.convert'))
    }
  }

  const getIPClass = () => {
    setError('')
    setResult('')

    try {
      const trimmed = input.trim()

      if (!isValidIPv4(trimmed)) {
        setError(t('ipv4.error.invalidIp'))
        return
      }

      const firstOctet = parseInt(trimmed.split('.')[0], 10)
      let ipClass = ''
      let range = ''
      let defaultMask = ''
      let type = ''

      if (firstOctet >= 1 && firstOctet <= 126) {
        ipClass = 'A'
        range = '1.0.0.0 - 126.255.255.255'
        defaultMask = '255.0.0.0 (/8)'
        type = t('ipv4.class.typeA')
      } else if (firstOctet >= 128 && firstOctet <= 191) {
        ipClass = 'B'
        range = '128.0.0.0 - 191.255.255.255'
        defaultMask = '255.255.0.0 (/16)'
        type = t('ipv4.class.typeB')
      } else if (firstOctet >= 192 && firstOctet <= 223) {
        ipClass = 'C'
        range = '192.0.0.0 - 223.255.255.255'
        defaultMask = '255.255.255.0 (/24)'
        type = t('ipv4.class.typeC')
      } else if (firstOctet >= 224 && firstOctet <= 239) {
        ipClass = 'D'
        range = '224.0.0.0 - 239.255.255.255'
        defaultMask = '해당 없음'
        type = t('ipv4.class.typeD')
      } else if (firstOctet >= 240 && firstOctet <= 255) {
        ipClass = 'E'
        range = '240.0.0.0 - 255.255.255.255'
        defaultMask = '해당 없음'
        type = t('ipv4.class.typeE')
      }

      // Check for private IP
      const isPrivate =
        trimmed.startsWith('10.') ||
        trimmed.startsWith('192.168.') ||
        (firstOctet === 172 && parseInt(trimmed.split('.')[1], 10) >= 16 && parseInt(trimmed.split('.')[1], 10) <= 31)

      // Check for loopback
      const isLoopback = trimmed.startsWith('127.')

      const info = {
        [t('ipv4.result.ip')]: trimmed,
        [t('ipv4.result.class')]: ipClass,
        [t('ipv4.result.range')]: range,
        [t('ipv4.result.defaultMask')]: defaultMask,
        [t('ipv4.result.usage')]: type,
        [t('ipv4.result.private')]: isPrivate ? t('ipv4.result.boolean.yes') : t('ipv4.result.boolean.no'),
        [t('ipv4.result.loopback')]: isLoopback ? t('ipv4.result.boolean.yes') : t('ipv4.result.boolean.no'),
      }

      setResult(Object.entries(info).map(([key, value]) => `${key}: ${value}`).join('\n'))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('ipv4.error.class'))
    }
  }

  return (
    <ToolCard
      title={`🌐 ${t('ipv4.title')}`}
      description={t('ipv4.description')}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('ipv4.input.label')}
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ipv4.input.placeholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={convertIP}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            🔄 {t('ipv4.actions.convert')}
          </button>
          <button
            onClick={getIPClass}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            📊 {t('ipv4.actions.class')}
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
          label={t('ipv4.result.label')}
          rows={10}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 {t('ipv4.examples.title')}</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• {t('ipv4.examples.ip')}</li>
            <li>• {t('ipv4.examples.decimal')}</li>
            <li>• {t('ipv4.examples.private')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
