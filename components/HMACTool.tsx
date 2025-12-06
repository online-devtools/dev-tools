'use client'

import { useState } from 'react'
import CryptoJS from 'crypto-js'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function HMACTool() {
  const [message, setMessage] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [algorithm, setAlgorithm] = useState('SHA256')
  const [output, setOutput] = useState('')

  const generateHMAC = () => {
    try {
      if (!message || !secretKey) {
        setOutput('메시지와 비밀 키를 모두 입력해주세요.')
        return
      }

      let hmac = ''
      switch (algorithm) {
        case 'MD5':
          hmac = CryptoJS.HmacMD5(message, secretKey).toString()
          break
        case 'SHA1':
          hmac = CryptoJS.HmacSHA1(message, secretKey).toString()
          break
        case 'SHA256':
          hmac = CryptoJS.HmacSHA256(message, secretKey).toString()
          break
        case 'SHA512':
          hmac = CryptoJS.HmacSHA512(message, secretKey).toString()
          break
        default:
          hmac = CryptoJS.HmacSHA256(message, secretKey).toString()
      }

      setOutput(hmac)
    } catch (error) {
      setOutput('HMAC 생성 중 오류가 발생했습니다.')
    }
  }

  return (
    <ToolCard
      title="HMAC Generator"
      description="비밀 키를 사용하여 메시지 인증 코드를 생성합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={message}
          onChange={setMessage}
          label="메시지"
          placeholder="인증할 메시지 입력"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            비밀 키 (Secret Key)
          </label>
          <input
            type="text"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="비밀 키 입력"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            해시 알고리즘
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="MD5">HMAC-MD5</option>
            <option value="SHA1">HMAC-SHA1</option>
            <option value="SHA256">HMAC-SHA256</option>
            <option value="SHA512">HMAC-SHA512</option>
          </select>
        </div>

        <button
          onClick={generateHMAC}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          생성
        </button>

        <TextAreaWithCopy
          value={output}
          readOnly
          label="HMAC 결과"
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">HMAC이란?</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• 비밀 키와 해시 함수를 사용한 메시지 인증 코드</li>
            <li>• API 요청 서명, 데이터 무결성 검증에 사용</li>
            <li>• 송신자와 수신자만 아는 비밀 키로 검증 가능</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
