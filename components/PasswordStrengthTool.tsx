'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PasswordStrengthTool() {
  const { t } = useLanguage()
  // 비밀번호와 표시 여부 상태를 관리해 실시간 분석 결과를 번역된 UI로 제공합니다.
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const analyzePassword = (pwd: string) => {
    const length = pwd.length
    const hasLowercase = /[a-z]/.test(pwd)
    const hasUppercase = /[A-Z]/.test(pwd)
    const hasNumbers = /\d/.test(pwd)
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    const hasSpaces = /\s/.test(pwd)

    // Calculate character set size
    let charsetSize = 0
    if (hasLowercase) charsetSize += 26
    if (hasUppercase) charsetSize += 26
    if (hasNumbers) charsetSize += 10
    if (hasSymbols) charsetSize += 32

    // Calculate entropy
    const entropy = length * Math.log2(charsetSize)

    // Check for common patterns
    const hasSequential = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(pwd)
    const hasRepeating = /(.)\1{2,}/.test(pwd)
    const hasKeyboardPattern = /(qwer|asdf|zxcv|1234|!@#\$)/i.test(pwd)

    // Common passwords (simplified check)
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'letmein', 'monkey', 'password123', '12345678']
    const isCommon = commonPasswords.some(common => pwd.toLowerCase().includes(common))

    // Calculate strength score
    let score = 0
    if (length >= 8) score += 20
    if (length >= 12) score += 10
    if (length >= 16) score += 10
    if (hasLowercase) score += 10
    if (hasUppercase) score += 10
    if (hasNumbers) score += 10
    if (hasSymbols) score += 20
    if (!hasSequential) score += 5
    if (!hasRepeating) score += 5
    if (!hasKeyboardPattern) score += 5
    if (!isCommon) score += 5

    // Deduct points for weaknesses
    if (hasSpaces) score -= 5
    if (hasSequential) score -= 10
    if (hasRepeating) score -= 10
    if (hasKeyboardPattern) score -= 10
    if (isCommon) score -= 30

    score = Math.max(0, Math.min(100, score))

    // Determine strength level
    let strength = ''
    let strengthColor = ''
    let strengthBg = ''

    if (score >= 80) {
      strength = t('passwordStrength.level.veryStrong')
      strengthColor = 'text-green-700 dark:text-green-400'
      strengthBg = 'bg-green-500'
    } else if (score >= 60) {
      strength = t('passwordStrength.level.strong')
      strengthColor = 'text-blue-700 dark:text-blue-400'
      strengthBg = 'bg-blue-500'
    } else if (score >= 40) {
      strength = t('passwordStrength.level.medium')
      strengthColor = 'text-yellow-700 dark:text-yellow-400'
      strengthBg = 'bg-yellow-500'
    } else if (score >= 20) {
      strength = t('passwordStrength.level.weak')
      strengthColor = 'text-orange-700 dark:text-orange-400'
      strengthBg = 'bg-orange-500'
    } else {
      strength = t('passwordStrength.level.veryWeak')
      strengthColor = 'text-red-700 dark:text-red-400'
      strengthBg = 'bg-red-500'
    }

    // Calculate time to crack (simplified)
    const possibleCombinations = Math.pow(charsetSize, length)
    const guessesPerSecond = 1e9 // 1 billion guesses per second (modern GPU)
    const secondsToCrack = possibleCombinations / guessesPerSecond

    let timeToCrack = ''
    if (secondsToCrack < 1) {
      timeToCrack = t('passwordStrength.time.instant')
    } else if (secondsToCrack < 60) {
      timeToCrack = t('passwordStrength.time.seconds', { value: Math.round(secondsToCrack) })
    } else if (secondsToCrack < 3600) {
      timeToCrack = t('passwordStrength.time.minutes', { value: Math.round(secondsToCrack / 60) })
    } else if (secondsToCrack < 86400) {
      timeToCrack = t('passwordStrength.time.hours', { value: Math.round(secondsToCrack / 3600) })
    } else if (secondsToCrack < 31536000) {
      timeToCrack = t('passwordStrength.time.days', { value: Math.round(secondsToCrack / 86400) })
    } else if (secondsToCrack < 31536000000) {
      timeToCrack = t('passwordStrength.time.years', { value: Math.round(secondsToCrack / 31536000) })
    } else {
      timeToCrack = t('passwordStrength.time.megaYears')
    }

    return {
      length,
      hasLowercase,
      hasUppercase,
      hasNumbers,
      hasSymbols,
      hasSpaces,
      hasSequential,
      hasRepeating,
      hasKeyboardPattern,
      isCommon,
      charsetSize,
      entropy: entropy.toFixed(2),
      score,
      strength,
      strengthColor,
      strengthBg,
      timeToCrack,
    }
  }

  const analysis = password ? analyzePassword(password) : null

  const suggestions = []
  if (analysis) {
    if (analysis.length < 12) suggestions.push(t('passwordStrength.suggestions.length'))
    if (!analysis.hasLowercase) suggestions.push(t('passwordStrength.suggestions.lowercase'))
    if (!analysis.hasUppercase) suggestions.push(t('passwordStrength.suggestions.uppercase'))
    if (!analysis.hasNumbers) suggestions.push(t('passwordStrength.suggestions.numbers'))
    if (!analysis.hasSymbols) suggestions.push(t('passwordStrength.suggestions.symbols'))
    if (analysis.hasSequential) suggestions.push(t('passwordStrength.suggestions.sequential'))
    if (analysis.hasRepeating) suggestions.push(t('passwordStrength.suggestions.repeating'))
    if (analysis.hasKeyboardPattern) suggestions.push(t('passwordStrength.suggestions.keyboard'))
    if (analysis.isCommon) suggestions.push(t('passwordStrength.suggestions.common'))
  }

  return (
    <ToolCard
      title={`🛡️ ${t('passwordStrength.title')}`}
      description={t('passwordStrength.description')}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('passwordStrength.input.label')}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordStrength.input.placeholder')}
              className="w-full px-3 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              {showPassword ? t('passwordStrength.input.hide') : t('passwordStrength.input.show')}
            </button>
          </div>
        </div>

        {analysis && (
          <>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('passwordStrength.output.strength')}:
                </span>
                <span className={`text-lg font-bold ${analysis.strengthColor}`}>
                  {analysis.strength}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`${analysis.strengthBg} h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t('passwordStrength.output.score', { value: analysis.score })}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t('passwordStrength.output.entropy', { value: analysis.entropy })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">{t('passwordStrength.metrics.length')}</p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-300">{t('passwordStrength.metrics.lengthValue', { value: analysis.length })}</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">{t('passwordStrength.metrics.charset')}</p>
                <p className="text-lg font-bold text-purple-900 dark:text-purple-300">{analysis.charsetSize}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📊 {t('passwordStrength.sections.composition')}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{t('passwordStrength.composition.lowercase')}</span>
                  <span>{analysis.hasLowercase ? '✅' : '❌'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{t('passwordStrength.composition.uppercase')}</span>
                  <span>{analysis.hasUppercase ? '✅' : '❌'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{t('passwordStrength.composition.numbers')}</span>
                  <span>{analysis.hasNumbers ? '✅' : '❌'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{t('passwordStrength.composition.symbols')}</span>
                  <span>{analysis.hasSymbols ? '✅' : '❌'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⚠️ {t('passwordStrength.sections.weakness')}</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{t('passwordStrength.weakness.sequential')}</span>
                  <span>{analysis.hasSequential ? t('passwordStrength.weakness.found') : t('passwordStrength.weakness.none')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{t('passwordStrength.weakness.repeating')}</span>
                  <span>{analysis.hasRepeating ? t('passwordStrength.weakness.found') : t('passwordStrength.weakness.none')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{t('passwordStrength.weakness.keyboard')}</span>
                  <span>{analysis.hasKeyboardPattern ? t('passwordStrength.weakness.found') : t('passwordStrength.weakness.none')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{t('passwordStrength.weakness.common')}</span>
                  <span>{analysis.isCommon ? t('passwordStrength.weakness.used') : t('passwordStrength.weakness.safe')}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-1">⏱️ {t('passwordStrength.sections.timeToCrack')}</h4>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">{analysis.timeToCrack}</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                {t('passwordStrength.time.note')}
              </p>
            </div>

            {suggestions.length > 0 && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 className="font-semibold text-red-900 dark:text-red-300 mb-2">💡 {t('passwordStrength.sections.improve')}</h4>
                <ul className="space-y-1 text-sm text-red-800 dark:text-red-400">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">🔒 {t('passwordStrength.sections.tips')}</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• {t('passwordStrength.tips.length')}</li>
            <li>• {t('passwordStrength.tips.mix')}</li>
            <li>• {t('passwordStrength.tips.personal')}</li>
            <li>• {t('passwordStrength.tips.unique')}</li>
            <li>• {t('passwordStrength.tips.manager')}</li>
          </ul>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            ℹ️ {t('passwordStrength.privacy')}
          </p>
        </div>
      </div>
    </ToolCard>
  )
}
