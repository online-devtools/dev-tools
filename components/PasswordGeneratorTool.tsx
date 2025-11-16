'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type StrengthLevel = 'weak' | 'medium' | 'strong'
interface StrengthState {
  score: number
  level: StrengthLevel
}

export default function PasswordGeneratorTool() {
  const { t } = useLanguage()
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState<StrengthState>({ score: 0, level: 'weak' })

  // Generate the password entirely on the client via crypto.getRandomValues for security.
  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

    let chars = ''
    if (includeUppercase) chars += uppercase
    if (includeLowercase) chars += lowercase
    if (includeNumbers) chars += numbers
    if (includeSymbols) chars += symbols

    if (chars === '') {
      setPassword('')
      return
    }

    let result = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)

    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }

    setPassword(result)
    calculateStrength(result)
  }

  // Basic heuristic so users know if additional character classes/length are needed.
  const calculateStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (pwd.length >= 16) score++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[^a-zA-Z\d]/.test(pwd)) score++

    if (score <= 2) {
      setStrength({ score, level: 'weak' })
    } else if (score <= 4) {
      setStrength({ score, level: 'medium' })
    } else {
      setStrength({ score, level: 'strong' })
    }
  }

  const strengthLabelClasses: Record<StrengthLevel, string> = {
    weak: 'text-red-600 dark:text-red-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    strong: 'text-green-600 dark:text-green-400',
  }

  const strengthBarClasses: Record<StrengthLevel, string> = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500',
  }

  const tips = [
    t('password.tips.1'),
    t('password.tips.2'),
    t('password.tips.3'),
    t('password.tips.4'),
  ]

  return (
    <ToolCard
      title={`🔐 ${t('password.title')}`}
      description={t('password.description')}
    >
      <div className="space-y-6">
        {/* Length Control */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('password.length.label', { length })}
            </label>
          </div>
          <input
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t('password.options.uppercase')}
            </span>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t('password.options.lowercase')}
            </span>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t('password.options.numbers')}
            </span>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t('password.options.symbols')}
            </span>
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          {t('password.actions.generate')}
        </button>

        {/* Generated Password */}
        {password && (
          <div className="space-y-4">
            <TextAreaWithCopy
              value={password}
              readOnly
              label={t('password.result.label')}
              rows={2}
            />

            {/* Strength Indicator */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('password.strength.title')}
                </span>
                <span className={`text-sm font-semibold ${strengthLabelClasses[strength.level]}`}>
                  {t(`password.strength.${strength.level}`)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${strengthBarClasses[strength.level]}`}
                  style={{ width: `${(strength.score / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Security Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">
            {t('password.tips.title')}
          </h3>
          <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
