'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import CryptoJS from 'crypto-js'

type EncryptionType = 'one-way' | 'two-way'
type ActionType = 'encrypt' | 'decrypt' | 'match'

export default function JasyptTool() {
  // Encryption Section
  const [encryptionType, setEncryptionType] = useState<EncryptionType>('two-way')
  const [plainText, setPlainText] = useState('')
  const [encryptSecretKey, setEncryptSecretKey] = useState('')
  const [encryptedResult, setEncryptedResult] = useState('')

  // Decryption Section
  const [encryptedText, setEncryptedText] = useState('')
  const [actionType, setActionType] = useState<ActionType>('decrypt')
  const [plainTextToMatch, setPlainTextToMatch] = useState('')
  const [decryptSecretKey, setDecryptSecretKey] = useState('')
  const [decryptResult, setDecryptResult] = useState('')

  const [error, setError] = useState('')

  // One-way encryption (해시)
  const oneWayEncrypt = (text: string): string => {
    return CryptoJS.MD5(text).toString()
  }

  // Two-way encryption (Jasypt 스타일)
  const twoWayEncrypt = (text: string, password: string): string => {
    const encrypted = CryptoJS.AES.encrypt(text, password).toString()
    return encrypted
  }

  // Two-way decryption
  const twoWayDecrypt = (encryptedText: string, password: string): string => {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, password)
    return decrypted.toString(CryptoJS.enc.Utf8)
  }

  // Encrypt 버튼 핸들러
  const handleEncrypt = () => {
    try {
      setError('')
      setEncryptedResult('')

      if (!plainText.trim()) {
        setError('암호화할 텍스트를 입력해주세요.')
        return
      }

      if (encryptionType === 'one-way') {
        // 일방향 암호화 (해시)
        const hashed = oneWayEncrypt(plainText)
        setEncryptedResult(hashed)
      } else {
        // 양방향 암호화
        if (!encryptSecretKey.trim()) {
          setError('암호화 키를 입력해주세요.')
          return
        }
        const encrypted = twoWayEncrypt(plainText, encryptSecretKey)
        setEncryptedResult(encrypted)
      }
    } catch (e) {
      console.error('Encryption error:', e)
      setError(`암호화 실패: ${e instanceof Error ? e.message : '오류가 발생했습니다.'}`)
    }
  }

  // Decrypt/Match 버튼 핸들러
  const handleDecryptOrMatch = () => {
    try {
      setError('')
      setDecryptResult('')

      if (!encryptedText.trim()) {
        setError('암호화된 텍스트를 입력해주세요.')
        return
      }

      if (actionType === 'match') {
        // Match Password
        if (!plainTextToMatch.trim()) {
          setError('비교할 평문을 입력해주세요.')
          return
        }

        const hashedInput = oneWayEncrypt(plainTextToMatch)
        if (hashedInput === encryptedText.trim()) {
          setDecryptResult('✅ Match! 비밀번호가 일치합니다.')
        } else {
          setDecryptResult('❌ Not Match! 비밀번호가 일치하지 않습니다.')
        }
      } else {
        // Decrypt
        if (!decryptSecretKey.trim()) {
          setError('복호화 키를 입력해주세요.')
          return
        }

        const decrypted = twoWayDecrypt(encryptedText.trim(), decryptSecretKey)
        if (!decrypted) {
          setError('복호화 실패: 올바른 암호문과 키를 확인해주세요.')
          return
        }
        setDecryptResult(decrypted)
      }
    } catch (e) {
      console.error('Decryption/Match error:', e)
      setError(`처리 실패: ${e instanceof Error ? e.message : '올바른 값을 입력해주세요.'}`)
    }
  }

  const handleClearEncrypt = () => {
    setPlainText('')
    setEncryptSecretKey('')
    setEncryptedResult('')
    setError('')
  }

  const handleClearDecrypt = () => {
    setEncryptedText('')
    setPlainTextToMatch('')
    setDecryptSecretKey('')
    setDecryptResult('')
    setError('')
  }

  return (
    <div className="space-y-8">
      {/* Jasypt Encryption Section */}
      <ToolCard
        title="🔐 Jasypt Encryption"
        description="평문을 암호화합니다"
      >
        <div className="space-y-4">
          {/* Plain Text Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter Plain Text to Encrypt
            </label>
            <input
              type="text"
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              placeholder="암호화할 텍스트를 입력하세요..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Encryption Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Type of Encryption
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="one-way"
                  checked={encryptionType === 'one-way'}
                  onChange={(e) => setEncryptionType(e.target.value as EncryptionType)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  One Way Encryption (Without Secret Text)
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="two-way"
                  checked={encryptionType === 'two-way'}
                  onChange={(e) => setEncryptionType(e.target.value as EncryptionType)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Two Way Encryption (With Secret Text)
                </span>
              </label>
            </div>
          </div>

          {/* Secret Key (only for two-way) */}
          {encryptionType === 'two-way' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Enter Secret Key
              </label>
              <input
                type="password"
                value={encryptSecretKey}
                onChange={(e) => setEncryptSecretKey(e.target.value)}
                placeholder="암호화 키를 입력하세요..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
              />
            </div>
          )}

          {/* Encrypt Button */}
          <div className="flex gap-3">
            <button
              onClick={handleEncrypt}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Encrypt
            </button>
            <button
              onClick={handleClearEncrypt}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Encrypted Result */}
          {encryptedResult && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Jasypt Encrypted String
              </label>
              <div className="relative">
                <textarea
                  value={encryptedResult}
                  readOnly
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm text-gray-800 dark:text-gray-200"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(encryptedResult)}
                  className="absolute top-2 right-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </ToolCard>

      {/* Jasypt Decryption Section */}
      <ToolCard
        title="🔓 Jasypt Decryption"
        description="암호화된 텍스트를 복호화하거나 비밀번호를 검증합니다"
      >
        <div className="space-y-4">
          {/* Encrypted Text Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter Jasypt Encrypted Text
            </label>
            <input
              type="text"
              value={encryptedText}
              onChange={(e) => setEncryptedText(e.target.value)}
              placeholder="암호화된 텍스트를 입력하세요..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Action Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Action Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="match"
                  checked={actionType === 'match'}
                  onChange={(e) => setActionType(e.target.value as ActionType)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Match Password
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="decrypt"
                  checked={actionType === 'decrypt'}
                  onChange={(e) => setActionType(e.target.value as ActionType)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Decrypt Password
                </span>
              </label>
            </div>
          </div>

          {/* Plain Text to Match (only for match action) */}
          {actionType === 'match' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Enter the Plain Text to Match
              </label>
              <input
                type="text"
                value={plainTextToMatch}
                onChange={(e) => setPlainTextToMatch(e.target.value)}
                placeholder="비교할 평문을 입력하세요..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
              />
            </div>
          )}

          {/* Secret Key for Decryption */}
          {actionType === 'decrypt' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Secret Key Used during Encryption
              </label>
              <input
                type="password"
                value={decryptSecretKey}
                onChange={(e) => setDecryptSecretKey(e.target.value)}
                placeholder="복호화 키를 입력하세요..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
              />
            </div>
          )}

          {/* Decrypt/Match Button */}
          <div className="flex gap-3">
            <button
              onClick={handleDecryptOrMatch}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              {actionType === 'match' ? 'Match' : 'Decrypt'}
            </button>
            <button
              onClick={handleClearDecrypt}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Result */}
          {decryptResult && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Result:
              </label>
              <div className={`p-4 rounded-lg border ${
                decryptResult.includes('✅')
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  : decryptResult.includes('❌')
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600'
              }`}>
                <p className="text-gray-800 dark:text-gray-200 font-mono">
                  {decryptResult}
                </p>
              </div>
            </div>
          )}
        </div>
      </ToolCard>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">
        <p className="font-semibold mb-2">💡 사용 방법:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>One Way Encryption:</strong> MD5 해시를 사용한 일방향 암호화 (복호화 불가능)</li>
          <li><strong>Two Way Encryption:</strong> AES를 사용한 양방향 암호화 (복호화 가능)</li>
          <li><strong>Match Password:</strong> 입력한 평문이 암호화된 값과 일치하는지 확인</li>
          <li><strong>Decrypt Password:</strong> 암호화된 텍스트를 원본으로 복호화</li>
        </ul>
      </div>
    </div>
  )
}
