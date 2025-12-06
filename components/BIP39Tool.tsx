'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import * as bip39 from 'bip39'

export default function BIP39Tool() {
  const [wordCount, setWordCount] = useState<12 | 15 | 18 | 21 | 24>(12)
  const [mnemonic, setMnemonic] = useState('')
  const [inputMnemonic, setInputMnemonic] = useState('')
  const [seed, setSeed] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState('')
  const [language, setLanguage] = useState<'english' | 'korean' | 'japanese' | 'chinese_simplified'>('english')

  const wordCounts = [12, 15, 18, 21, 24]

  const getWordlist = (lang: string) => {
    switch (lang) {
      case 'korean':
        return bip39.wordlists.korean
      case 'japanese':
        return bip39.wordlists.japanese
      case 'chinese_simplified':
        return bip39.wordlists.chinese_simplified
      default:
        return bip39.wordlists.english
    }
  }

  const generateMnemonic = () => {
    setError('')
    setMnemonic('')
    setSeed('')

    try {
      const strength = (wordCount * 32) / 3 // Convert word count to entropy bits
      const wordlist = getWordlist(language)
      const generated = bip39.generateMnemonic(strength, undefined, wordlist)
      setMnemonic(generated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mnemonic 생성 중 오류가 발생했습니다')
    }
  }

  const validateMnemonic = () => {
    setError('')

    try {
      if (!inputMnemonic.trim()) {
        setError('Mnemonic을 입력해주세요')
        return
      }

      const wordlist = getWordlist(language)
      const valid = bip39.validateMnemonic(inputMnemonic.trim(), wordlist)

      if (valid) {
        setError('')
        alert('✅ 유효한 BIP39 Mnemonic입니다!')
      } else {
        setError('❌ 유효하지 않은 BIP39 Mnemonic입니다')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mnemonic 검증 중 오류가 발생했습니다')
    }
  }

  const mnemonicToSeed = () => {
    setError('')
    setSeed('')

    try {
      const mnemonicToUse = inputMnemonic.trim() || mnemonic

      if (!mnemonicToUse) {
        setError('Mnemonic을 입력하거나 생성해주세요')
        return
      }

      const wordlist = getWordlist(language)
      if (!bip39.validateMnemonic(mnemonicToUse, wordlist)) {
        setError('유효하지 않은 Mnemonic입니다')
        return
      }

      const seedBuffer = bip39.mnemonicToSeedSync(mnemonicToUse, passphrase)
      const seedHex = seedBuffer.toString('hex')
      setSeed(seedHex)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Seed 생성 중 오류가 발생했습니다')
    }
  }

  const entropyToMnemonic = (entropyHex: string) => {
    setError('')
    setMnemonic('')

    try {
      if (!entropyHex.trim()) {
        setError('Entropy(16진수)를 입력해주세요')
        return
      }

      const cleaned = entropyHex.trim().replace(/[^0-9a-fA-F]/g, '')

      if (!/^[0-9a-fA-F]+$/.test(cleaned)) {
        setError('유효한 16진수 값을 입력해주세요')
        return
      }

      const validLengths = [32, 40, 48, 56, 64] // 128, 160, 192, 224, 256 bits
      if (!validLengths.includes(cleaned.length)) {
        setError(`Entropy 길이는 ${validLengths.join(', ')} 문자(16진수) 중 하나여야 합니다`)
        return
      }

      const wordlist = getWordlist(language)
      const generated = bip39.entropyToMnemonic(cleaned, wordlist)
      setMnemonic(generated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Entropy에서 Mnemonic 생성 중 오류가 발생했습니다')
    }
  }

  const mnemonicToEntropy = () => {
    setError('')

    try {
      const mnemonicToUse = inputMnemonic.trim() || mnemonic

      if (!mnemonicToUse) {
        setError('Mnemonic을 입력하거나 생성해주세요')
        return
      }

      const wordlist = getWordlist(language)
      if (!bip39.validateMnemonic(mnemonicToUse, wordlist)) {
        setError('유효하지 않은 Mnemonic입니다')
        return
      }

      const entropy = bip39.mnemonicToEntropy(mnemonicToUse, wordlist)
      alert(`Entropy (16진수):\n${entropy}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Entropy 추출 중 오류가 발생했습니다')
    }
  }

  return (
    <ToolCard
      title="BIP39 Mnemonic Generator"
      description="암호화폐 지갑용 BIP39 니모닉 구문을 생성하고 검증합니다"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              단어 개수
            </label>
            <select
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value) as 12 | 15 | 18 | 21 | 24)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {wordCounts.map((count) => (
                <option key={count} value={count}>
                  {count} 단어 ({(count * 32) / 3} bits)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              언어
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="english">English</option>
              <option value="korean">한국어</option>
              <option value="japanese">日本語</option>
              <option value="chinese_simplified">简体中文</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateMnemonic}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          🎲 Mnemonic 생성
        </button>

        {mnemonic && (
          <TextAreaWithCopy
            value={mnemonic}
            readOnly
            label="생성된 Mnemonic"
            rows={3}
          />
        )}

        <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mnemonic 입력 (검증/변환용)
          </label>
          <textarea
            value={inputMnemonic}
            onChange={(e) => setInputMnemonic(e.target.value)}
            placeholder="단어들을 공백으로 구분하여 입력하세요"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={validateMnemonic}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            ✅ 검증
          </button>
          <button
            onClick={mnemonicToEntropy}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            🔢 Entropy 추출
          </button>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Passphrase (선택사항)
          </label>
          <input
            type="text"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="BIP39 passphrase (25th word)"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Passphrase는 추가 보안 계층을 제공합니다 (BIP39 25th word)
          </p>
        </div>

        <button
          onClick={mnemonicToSeed}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          🌱 Seed 생성
        </button>

        {seed && (
          <TextAreaWithCopy
            value={seed}
            readOnly
            label="생성된 Seed (64바이트 16진수)"
            rows={4}
          />
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">⚠️ 보안 경고</h4>
          <ul className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
            <li>• Mnemonic은 암호화폐 지갑의 마스터 키입니다</li>
            <li>• 절대로 다른 사람과 공유하지 마세요</li>
            <li>• 안전한 오프라인 환경에서 보관하세요</li>
            <li>• 이 도구는 테스트/교육 목적으로만 사용하세요</li>
            <li>• 실제 자산용 지갑은 하드웨어 지갑 사용을 권장합니다</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 BIP39란?</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• Bitcoin Improvement Proposal 39</li>
            <li>• 니모닉 구문을 사용한 결정적 키 생성 표준</li>
            <li>• 12-24개의 단어로 암호화폐 지갑을 복구할 수 있습니다</li>
            <li>• 대부분의 주요 암호화폐 지갑에서 지원됩니다</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
