'use client'

import React, { useState } from 'react'
import ToolCard from './ToolCard'
import CryptoJS from 'crypto-js'
import { useLanguage } from '@/contexts/LanguageContext'

type EncryptionType = 'one-way' | 'two-way'
type ActionType = 'encrypt' | 'decrypt' | 'match'

export default function JasyptTool() {
  const { t } = useLanguage()
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

  // OpenSSL EVP_BytesToKey algorithm for key derivation
  const evpBytesToKey = (password: string, salt: CryptoJS.lib.WordArray, keySize: number, ivSize: number) => {
    const passwordWordArray = CryptoJS.enc.Utf8.parse(password)
    let derivedKey = CryptoJS.lib.WordArray.create()
    let block = CryptoJS.lib.WordArray.create()

    while (derivedKey.sigBytes < (keySize + ivSize) * 4) {
      if (block.sigBytes > 0) {
        block = CryptoJS.MD5(block.concat(passwordWordArray).concat(salt))
      } else {
        block = CryptoJS.MD5(passwordWordArray.concat(salt))
      }
      derivedKey = derivedKey.concat(block)
    }

    return {
      key: CryptoJS.lib.WordArray.create(derivedKey.words.slice(0, keySize)),
      iv: CryptoJS.lib.WordArray.create(derivedKey.words.slice(keySize, keySize + ivSize))
    }
  }

  // Jasypt PBE Encryption (OpenSSL compatible)
  const jasyptEncrypt = (text: string, password: string): string => {
    // Generate random salt (8 bytes)
    const salt = CryptoJS.lib.WordArray.random(8)

    // Derive key and IV using OpenSSL EVP_BytesToKey (MD5)
    // AES-256 requires 32 bytes (8 words) for key, 16 bytes (4 words) for IV
    const derived = evpBytesToKey(password, salt, 8, 4)

    // Encrypt using AES
    const encrypted = CryptoJS.AES.encrypt(text, derived.key, {
      iv: derived.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    // OpenSSL format: "Salted__" + salt + ciphertext
    const saltedPrefix = CryptoJS.enc.Utf8.parse('Salted__')
    const combined = saltedPrefix.concat(salt).concat(encrypted.ciphertext)

    // Return Base64 encoded result
    return CryptoJS.enc.Base64.stringify(combined)
  }

  // Jasypt PBE Decryption
  const jasyptDecrypt = (encryptedText: string, password: string): string => {
    try {
      // Decode Base64
      const combined = CryptoJS.enc.Base64.parse(encryptedText)

      // Check for "Salted__" prefix (OpenSSL format)
      const saltedPrefix = CryptoJS.lib.WordArray.create(combined.words.slice(0, 2))
      const saltedPrefixStr = CryptoJS.enc.Utf8.stringify(saltedPrefix)

      if (saltedPrefixStr !== 'Salted__') {
        throw new Error('잘못된 암호화 형식입니다')
      }

      // Extract salt (8 bytes after "Salted__")
      const salt = CryptoJS.lib.WordArray.create(combined.words.slice(2, 4))

      // Extract encrypted data (remaining bytes)
      const ciphertext = CryptoJS.lib.WordArray.create(
        combined.words.slice(4),
        combined.sigBytes - 16 // 8 bytes prefix + 8 bytes salt
      )

      // Derive key and IV using same method as encryption
      const derived = evpBytesToKey(password, salt, 8, 4)

      // Decrypt
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext } as any,
        derived.key,
        {
          iv: derived.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      )

      const result = decrypted.toString(CryptoJS.enc.Utf8)

      // Validate decryption result
      if (!result || result.length === 0) {
        throw new Error('잘못된 비밀키이거나 암호화 텍스트가 손상되었습니다')
      }

      return result
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`복호화 실패: ${e.message}`)
      }
      throw new Error('복호화 실패: 잘못된 암호화 텍스트 또는 비밀키')
    }
  }

  // Encrypt 버튼 핸들러
  const handleEncrypt = () => {
    try {
      setError('')
      setEncryptedResult('')

      if (!plainText.trim()) {
        setError(t('jasypt.error.plaintext'))
        return
      }

      if (encryptionType === 'one-way') {
        // 일방향 암호화 (해시)
        const hashed = oneWayEncrypt(plainText)
        setEncryptedResult(hashed)
      } else {
        // 양방향 암호화 (Jasypt PBE)
        if (!encryptSecretKey.trim()) {
          setError(t('jasypt.error.secretkey'))
          return
        }
        const encrypted = jasyptEncrypt(plainText, encryptSecretKey)
        setEncryptedResult(encrypted)
      }
    } catch (e) {
      console.error('Encryption error:', e)
      setError(`${t('jasypt.error.encrypt')}: ${e instanceof Error ? e.message : t('jasypt.error.generic')}`)
    }
  }

  // Decrypt/Match 버튼 핸들러
  const handleDecryptOrMatch = () => {
    try {
      setError('')
      setDecryptResult('')

      if (!encryptedText.trim()) {
        setError(t('jasypt.error.encryptedtext'))
        return
      }

      if (actionType === 'match') {
        // Match Password
        if (!plainTextToMatch.trim()) {
          setError(t('jasypt.error.plainmatch'))
          return
        }

        const hashedInput = oneWayEncrypt(plainTextToMatch)
        if (hashedInput === encryptedText.trim()) {
          setDecryptResult(`✅ ${t('jasypt.match.success')}`)
        } else {
          setDecryptResult(`❌ ${t('jasypt.match.fail')}`)
        }
      } else {
        // Decrypt (Jasypt PBE)
        if (!decryptSecretKey.trim()) {
          setError(t('jasypt.error.decryptkey'))
          return
        }

        const decrypted = jasyptDecrypt(encryptedText.trim(), decryptSecretKey)
        if (!decrypted) {
          setError(t('jasypt.error.decrypt'))
          return
        }
        setDecryptResult(decrypted)
      }
    } catch (e) {
      console.error('Decryption/Match error:', e)
      setError(`${t('jasypt.error.process')}: ${e instanceof Error ? e.message : t('jasypt.error.generic')}`)
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
        title={t('jasypt.encryption.title')}
        description={t('jasypt.encryption.description')}
      >
        <div className="space-y-4">
          {/* Plain Text Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('jasypt.plaintext')}
            </label>
            <input
              type="text"
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              placeholder={t('jasypt.plaintext.placeholder')}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Encryption Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('jasypt.encryptionType')}
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
                  {t('jasypt.oneWay')}
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
                  {t('jasypt.twoWay')}
                </span>
              </label>
            </div>
          </div>

          {/* Secret Key (only for two-way) */}
          {encryptionType === 'two-way' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('jasypt.secretKey')}
              </label>
              <input
                type="password"
                value={encryptSecretKey}
                onChange={(e) => setEncryptSecretKey(e.target.value)}
                placeholder={t('jasypt.secretKey.placeholder')}
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
              {t('jasypt.encrypt')}
            </button>
            <button
              onClick={handleClearEncrypt}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              {t('common.clear')}
            </button>
          </div>

          {/* Encrypted Result */}
          {encryptedResult && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('jasypt.result')}
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
                  {t('common.copy')}
                </button>
              </div>
            </div>
          )}
        </div>
      </ToolCard>

      {/* Jasypt Decryption Section */}
      <ToolCard
        title={t('jasypt.decryption.title')}
        description={t('jasypt.decryption.description')}
      >
        <div className="space-y-4">
          {/* Encrypted Text Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('jasypt.encryptedText')}
            </label>
            <input
              type="text"
              value={encryptedText}
              onChange={(e) => setEncryptedText(e.target.value)}
              placeholder={t('jasypt.encryptedText.placeholder')}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Action Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('jasypt.actionType')}
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
                  {t('jasypt.match')}
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
                  {t('jasypt.decrypt')}
                </span>
              </label>
            </div>
          </div>

          {/* Plain Text to Match (only for match action) */}
          {actionType === 'match' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('jasypt.plainMatch')}
              </label>
              <input
                type="text"
                value={plainTextToMatch}
                onChange={(e) => setPlainTextToMatch(e.target.value)}
                placeholder={t('jasypt.plainMatch.placeholder')}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200"
              />
            </div>
          )}

          {/* Secret Key for Decryption */}
          {actionType === 'decrypt' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('jasypt.decryptKey')}
              </label>
              <input
                type="password"
                value={decryptSecretKey}
                onChange={(e) => setDecryptSecretKey(e.target.value)}
                placeholder={t('jasypt.decryptKey.placeholder')}
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
              {actionType === 'match' ? t('jasypt.match') : t('jasypt.decrypt')}
            </button>
            <button
              onClick={handleClearDecrypt}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              {t('common.clear')}
            </button>
          </div>

          {/* Result */}
          {decryptResult && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('jasypt.resultLabel')}
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
        <p className="font-semibold mb-2">{t('jasypt.info.title')}</p>
        <ul className="list-disc list-inside space-y-1">
          <li>{t('jasypt.info.oneWay')}</li>
          <li>{t('jasypt.info.twoWay')}</li>
          <li>{t('jasypt.info.match')}</li>
          <li>{t('jasypt.info.decrypt')}</li>
        </ul>
      </div>
    </div>
  )
}
