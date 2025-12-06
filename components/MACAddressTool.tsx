'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function MACAddressTool() {
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
        setError('개수는 1에서 100 사이여야 합니다')
        return
      }

      const macs = []
      for (let i = 0; i < numCount; i++) {
        const mac = generateRandomMAC()
        macs.push(formatMAC(mac, separator, uppercase))
      }

      setOutput(macs.join('\n'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'MAC 주소 생성 중 오류가 발생했습니다')
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
        setError('MAC 주소를 입력해주세요')
        return
      }

      const lines = input.split('\n').filter(line => line.trim())
      const results = []

      for (const line of lines) {
        const mac = line.trim()

        if (!isValidMAC(mac)) {
          results.push(`❌ ${mac} - 유효하지 않은 MAC 주소`)
          continue
        }

        const normalized = normalizeMAC(mac)
        const formats = {
          '원본': mac,
          '정규화': normalized,
          'Colon (:)': formatMAC(normalized, ':', uppercase),
          'Hyphen (-)': formatMAC(normalized, '-', uppercase),
          'Dot (.)': formatMAC(normalized, '.', uppercase),
          'Cisco': normalized.match(/.{1,4}/g)?.join('.') || normalized,
        }

        results.push('✅ 유효한 MAC 주소:')
        results.push(Object.entries(formats).map(([key, value]) => `  ${key}: ${value}`).join('\n'))
        results.push('')
      }

      setOutput(results.join('\n'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'MAC 주소 검증 중 오류가 발생했습니다')
    }
  }

  const getVendorInfo = () => {
    setError('')
    setOutput('')

    if (!input.trim()) {
      setError('MAC 주소를 입력해주세요')
      return
    }

    const mac = normalizeMAC(input.trim())

    if (!isValidMAC(mac)) {
      setError('유효하지 않은 MAC 주소입니다')
      return
    }

    const oui = mac.substring(0, 6)
    const nic = mac.substring(6)

    // Check if it's locally administered
    const firstByte = parseInt(mac.substring(0, 2), 16)
    const isLocallyAdministered = (firstByte & 0x02) !== 0
    const isUnicast = (firstByte & 0x01) === 0

    const info = {
      '전체 MAC 주소': formatMAC(mac, ':', uppercase),
      'OUI (제조사 식별자)': formatMAC(oui, ':', uppercase),
      'NIC (네트워크 인터페이스 컨트롤러)': formatMAC(nic, ':', uppercase),
      '로컬 관리형': isLocallyAdministered ? '✅ 예' : '❌ 아니오',
      '유니캐스트': isUnicast ? '✅ 예' : '❌ 아니오 (멀티캐스트)',
    }

    let result = Object.entries(info).map(([key, value]) => `${key}: ${value}`).join('\n')

    if (isLocallyAdministered) {
      result += '\n\n💡 이 MAC 주소는 로컬 관리형이므로 제조사 정보가 없습니다.'
    } else {
      result += '\n\n💡 OUI로 제조사를 조회하려면 IEEE OUI 데이터베이스를 참조하세요.'
    }

    setOutput(result)
  }

  return (
    <ToolCard
      title="MAC Address Generator"
      description="MAC 주소를 생성하고 검증하며 다양한 형식으로 변환합니다"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              생성 개수
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
              구분자
            </label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value=":">Colon (:)</option>
              <option value="-">Hyphen (-)</option>
              <option value=".">Dot (.)</option>
              <option value="">None</option>
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
            대문자 사용
          </label>
        </div>

        <button
          onClick={generateMACs}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          🎲 MAC 주소 생성
        </button>

        <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            MAC 주소 입력 (검증/포맷팅용)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="00:1A:2B:3C:4D:5E&#10;00-1A-2B-3C-4D-5F&#10;001A.2B3C.4D60"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={validateAndFormat}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            ✅ 검증 & 포맷
          </button>
          <button
            onClick={getVendorInfo}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            🏢 정보 확인
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
          label="결과"
          rows={12}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 MAC 주소 정보</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• MAC 주소는 48비트(6옥텟)로 구성됩니다</li>
            <li>• 앞 24비트(3옥텟)는 OUI(제조사 식별자)입니다</li>
            <li>• 뒤 24비트(3옥텟)는 NIC(네트워크 인터페이스 식별자)입니다</li>
            <li>• 로컬 관리형 MAC 주소는 두 번째 비트가 1로 설정됩니다</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
