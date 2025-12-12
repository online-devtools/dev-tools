'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import * as bip39 from 'bip39'
import { useLanguage } from '@/contexts/LanguageContext'

export default function BIP39Tool() {
  const { t } = useLanguage()
  // 단어 개수/언어/입력된 니모닉/Seed/패스프레이즈 상태를 관리하며 BIP39 변환/검증 결과를 다국어로 표시합니다.
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
      setError(err instanceof Error ? err.message : t('bip39.error.generate'))
    }
  }

  const validateMnemonic = () => {
    setError('')

    try {
      if (!inputMnemonic.trim()) {
        setError(t('bip39.error.required'))
        return
      }

      const wordlist = getWordlist(language)
      const valid = bip39.validateMnemonic(inputMnemonic.trim(), wordlist)

      if (valid) {
        setError('')
        alert(t('bip39.validate.success'))
      } else {
        setError(t('bip39.validate.fail'))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('bip39.error.validate'))
    }
  }

  const mnemonicToSeed = () => {
    setError('')
    setSeed('')

    try {
      const mnemonicToUse = inputMnemonic.trim() || mnemonic

      if (!mnemonicToUse) {
        setError(t('bip39.error.requiredOrGenerate'))
        return
      }

      const wordlist = getWordlist(language)
      if (!bip39.validateMnemonic(mnemonicToUse, wordlist)) {
        setError(t('bip39.validate.fail'))
        return
      }

      const seedBuffer = bip39.mnemonicToSeedSync(mnemonicToUse, passphrase)
      const seedHex = seedBuffer.toString('hex')
      setSeed(seedHex)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('bip39.error.seed'))
    }
  }

  const entropyToMnemonic = (entropyHex: string) => {
    setError('')
    setMnemonic('')

    try {
      if (!entropyHex.trim()) {
        setError(t('bip39.error.entropyRequired'))
        return
      }

      const cleaned = entropyHex.trim().replace(/[^0-9a-fA-F]/g, '')

      if (!/^[0-9a-fA-F]+$/.test(cleaned)) {
        setError(t('bip39.error.entropyHex'))
        return
      }

      const validLengths = [32, 40, 48, 56, 64] // 128, 160, 192, 224, 256 bits
      if (!validLengths.includes(cleaned.length)) {
        setError(t('bip39.error.entropyLength', { lengths: validLengths.join(', ') }))
        return
      }

      const wordlist = getWordlist(language)
      const generated = bip39.entropyToMnemonic(cleaned, wordlist)
      setMnemonic(generated)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('bip39.error.entropyToMnemonic'))
    }
  }

  const mnemonicToEntropy = () => {
    setError('')

    try {
      const mnemonicToUse = inputMnemonic.trim() || mnemonic

      if (!mnemonicToUse) {
        setError(t('bip39.error.requiredOrGenerate'))
        return
      }

      const wordlist = getWordlist(language)
      if (!bip39.validateMnemonic(mnemonicToUse, wordlist)) {
        setError(t('bip39.validate.fail'))
        return
      }

      const entropy = bip39.mnemonicToEntropy(mnemonicToUse, wordlist)
      alert(t('bip39.entropy.result', { entropy }))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('bip39.error.entropyExtract'))
    }
  }

  return (
    <ToolCard
      title={`🪙 ${t('bip39.title')}`}
      description={t('bip39.description')}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('bip39.wordCount')}
            </label>
            <select
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value) as 12 | 15 | 18 | 21 | 24)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {wordCounts.map((count) => (
                <option key={count} value={count}>
                  {t('bip39.wordCountOption', { count, bits: (count * 32) / 3 })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('bip39.language')}
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
          🎲 {t('bip39.actions.generate')}
        </button>

        {mnemonic && (
          <TextAreaWithCopy
            value={mnemonic}
            readOnly
            label={t('bip39.result.mnemonic')}
            rows={3}
          />
        )}

        <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('bip39.input.label')}
          </label>
          <textarea
            value={inputMnemonic}
            onChange={(e) => setInputMnemonic(e.target.value)}
            placeholder={t('bip39.input.placeholder')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={validateMnemonic}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            ✅ {t('bip39.actions.validate')}
          </button>
          <button
            onClick={mnemonicToEntropy}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            🔢 {t('bip39.actions.toEntropy')}
          </button>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('bip39.passphrase.label')}
          </label>
          <input
            type="text"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder={t('bip39.passphrase.placeholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t('bip39.passphrase.help')}
          </p>
        </div>

        <button
          onClick={mnemonicToSeed}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          🌱 {t('bip39.actions.toSeed')}
        </button>

        {seed && (
          <TextAreaWithCopy
            value={seed}
            readOnly
            label={t('bip39.result.seed')}
            rows={4}
          />
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">⚠️ {t('bip39.security.title')}</h4>
          <ul className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
            <li>• {t('bip39.security.bullet1')}</li>
            <li>• {t('bip39.security.bullet2')}</li>
            <li>• {t('bip39.security.bullet3')}</li>
            <li>• {t('bip39.security.bullet4')}</li>
            <li>• {t('bip39.security.bullet5')}</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 {t('bip39.info.title')}</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• {t('bip39.info.bullet1')}</li>
            <li>• {t('bip39.info.bullet2')}</li>
            <li>• {t('bip39.info.bullet3')}</li>
            <li>• {t('bip39.info.bullet4')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
