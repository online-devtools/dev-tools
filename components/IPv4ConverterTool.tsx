'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function IPv4ConverterTool() {
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
        setError('IPv4 주소를 입력해주세요')
        return
      }

      // Check if input is a valid IPv4 address
      if (isValidIPv4(trimmed)) {
        const decimal = ipToDecimal(trimmed)
        const binary = ipToBinary(trimmed)
        const hex = ipToHex(trimmed)
        const octal = ipToOctal(trimmed)

        const info = {
          '원본 (점-십진 표기)': trimmed,
          '십진수': decimal.toString(),
          '이진수': binary,
          '16진수': hex,
          '8진수': octal,
          '16진수 (0x 접두사)': '0x' + trimmed.split('.').map(p => parseInt(p).toString(16).padStart(2, '0').toUpperCase()).join(''),
          '정수형': decimal.toString(),
        }

        setResult(Object.entries(info).map(([key, value]) => `${key}: ${value}`).join('\n'))
      }
      // Check if input is a decimal number
      else if (/^\d+$/.test(trimmed)) {
        const decimal = parseInt(trimmed, 10)
        if (decimal < 0 || decimal > 4294967295) {
          setError('십진수 값은 0에서 4294967295 사이여야 합니다')
          return
        }

        const ip = decimalToIP(decimal)
        const binary = ipToBinary(ip)
        const hex = ipToHex(ip)
        const octal = ipToOctal(ip)

        const info = {
          '십진수': trimmed,
          'IPv4 주소': ip,
          '이진수': binary,
          '16진수': hex,
          '8진수': octal,
        }

        setResult(Object.entries(info).map(([key, value]) => `${key}: ${value}`).join('\n'))
      }
      else {
        setError('유효한 IPv4 주소 또는 십진수를 입력해주세요')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '변환 중 오류가 발생했습니다')
    }
  }

  const getIPClass = () => {
    setError('')
    setResult('')

    try {
      const trimmed = input.trim()

      if (!isValidIPv4(trimmed)) {
        setError('유효한 IPv4 주소를 입력해주세요')
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
        type = '대규모 네트워크용'
      } else if (firstOctet >= 128 && firstOctet <= 191) {
        ipClass = 'B'
        range = '128.0.0.0 - 191.255.255.255'
        defaultMask = '255.255.0.0 (/16)'
        type = '중규모 네트워크용'
      } else if (firstOctet >= 192 && firstOctet <= 223) {
        ipClass = 'C'
        range = '192.0.0.0 - 223.255.255.255'
        defaultMask = '255.255.255.0 (/24)'
        type = '소규모 네트워크용'
      } else if (firstOctet >= 224 && firstOctet <= 239) {
        ipClass = 'D'
        range = '224.0.0.0 - 239.255.255.255'
        defaultMask = '해당 없음'
        type = '멀티캐스트용'
      } else if (firstOctet >= 240 && firstOctet <= 255) {
        ipClass = 'E'
        range = '240.0.0.0 - 255.255.255.255'
        defaultMask = '해당 없음'
        type = '실험적 용도'
      }

      // Check for private IP
      const isPrivate =
        trimmed.startsWith('10.') ||
        trimmed.startsWith('192.168.') ||
        (firstOctet === 172 && parseInt(trimmed.split('.')[1], 10) >= 16 && parseInt(trimmed.split('.')[1], 10) <= 31)

      // Check for loopback
      const isLoopback = trimmed.startsWith('127.')

      const info = {
        'IP 주소': trimmed,
        'IP 클래스': ipClass,
        '범위': range,
        '기본 서브넷 마스크': defaultMask,
        '용도': type,
        '사설 IP': isPrivate ? '✅ 예' : '❌ 아니오',
        '루프백': isLoopback ? '✅ 예' : '❌ 아니오',
      }

      setResult(Object.entries(info).map(([key, value]) => `${key}: ${value}`).join('\n'))
    } catch (err) {
      setError(err instanceof Error ? err.message : '클래스 확인 중 오류가 발생했습니다')
    }
  }

  return (
    <ToolCard
      title="IPv4 Address Converter"
      description="IPv4 주소를 다양한 형식으로 변환하고 정보를 확인합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            IPv4 주소 또는 십진수 입력
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="192.168.1.1 또는 3232235777"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={convertIP}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            🔄 형식 변환
          </button>
          <button
            onClick={getIPClass}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            📊 IP 클래스 확인
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
          rows={10}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 사용 예시</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• IP 주소 입력: 192.168.1.1</li>
            <li>• 십진수 입력: 3232235777</li>
            <li>• 사설 IP 범위: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
