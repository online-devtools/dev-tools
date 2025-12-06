'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'

export default function PasswordStrengthTool() {
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
      strength = '매우 강함'
      strengthColor = 'text-green-700 dark:text-green-400'
      strengthBg = 'bg-green-500'
    } else if (score >= 60) {
      strength = '강함'
      strengthColor = 'text-blue-700 dark:text-blue-400'
      strengthBg = 'bg-blue-500'
    } else if (score >= 40) {
      strength = '보통'
      strengthColor = 'text-yellow-700 dark:text-yellow-400'
      strengthBg = 'bg-yellow-500'
    } else if (score >= 20) {
      strength = '약함'
      strengthColor = 'text-orange-700 dark:text-orange-400'
      strengthBg = 'bg-orange-500'
    } else {
      strength = '매우 약함'
      strengthColor = 'text-red-700 dark:text-red-400'
      strengthBg = 'bg-red-500'
    }

    // Calculate time to crack (simplified)
    const possibleCombinations = Math.pow(charsetSize, length)
    const guessesPerSecond = 1e9 // 1 billion guesses per second (modern GPU)
    const secondsToCrack = possibleCombinations / guessesPerSecond

    let timeToCrack = ''
    if (secondsToCrack < 1) {
      timeToCrack = '즉시'
    } else if (secondsToCrack < 60) {
      timeToCrack = `${Math.round(secondsToCrack)}초`
    } else if (secondsToCrack < 3600) {
      timeToCrack = `${Math.round(secondsToCrack / 60)}분`
    } else if (secondsToCrack < 86400) {
      timeToCrack = `${Math.round(secondsToCrack / 3600)}시간`
    } else if (secondsToCrack < 31536000) {
      timeToCrack = `${Math.round(secondsToCrack / 86400)}일`
    } else if (secondsToCrack < 31536000000) {
      timeToCrack = `${Math.round(secondsToCrack / 31536000)}년`
    } else {
      timeToCrack = '수천만 년 이상'
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
    if (analysis.length < 12) suggestions.push('최소 12자 이상 사용하세요')
    if (!analysis.hasLowercase) suggestions.push('소문자를 포함하세요')
    if (!analysis.hasUppercase) suggestions.push('대문자를 포함하세요')
    if (!analysis.hasNumbers) suggestions.push('숫자를 포함하세요')
    if (!analysis.hasSymbols) suggestions.push('특수문자를 포함하세요')
    if (analysis.hasSequential) suggestions.push('연속된 문자/숫자를 피하세요')
    if (analysis.hasRepeating) suggestions.push('반복되는 문자를 피하세요')
    if (analysis.hasKeyboardPattern) suggestions.push('키보드 패턴을 피하세요')
    if (analysis.isCommon) suggestions.push('흔한 비밀번호를 사용하지 마세요')
  }

  return (
    <ToolCard
      title="Password Strength Analyzer"
      description="비밀번호 강도를 분석하고 보안 점수를 평가합니다"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            비밀번호 입력
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-3 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              {showPassword ? '숨기기' : '보기'}
            </button>
          </div>
        </div>

        {analysis && (
          <>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  강도:
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
                  점수: {analysis.score}/100
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  엔트로피: {analysis.entropy} bits
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">길이</p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-300">{analysis.length}자</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">문자 집합 크기</p>
                <p className="text-lg font-bold text-purple-900 dark:text-purple-300">{analysis.charsetSize}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📊 구성 요소</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">소문자 (a-z)</span>
                  <span>{analysis.hasLowercase ? '✅' : '❌'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">대문자 (A-Z)</span>
                  <span>{analysis.hasUppercase ? '✅' : '❌'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">숫자 (0-9)</span>
                  <span>{analysis.hasNumbers ? '✅' : '❌'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">특수문자 (!@#$...)</span>
                  <span>{analysis.hasSymbols ? '✅' : '❌'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⚠️ 취약점</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">연속된 문자/숫자</span>
                  <span>{analysis.hasSequential ? '❌ 발견됨' : '✅ 없음'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">반복 문자</span>
                  <span>{analysis.hasRepeating ? '❌ 발견됨' : '✅ 없음'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">키보드 패턴</span>
                  <span>{analysis.hasKeyboardPattern ? '❌ 발견됨' : '✅ 없음'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">흔한 비밀번호</span>
                  <span>{analysis.isCommon ? '❌ 사용함' : '✅ 안전함'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-1">⏱️ 예상 크래킹 시간</h4>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">{analysis.timeToCrack}</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                (현대 GPU 기준, 초당 10억 회 추측)
              </p>
            </div>

            {suggestions.length > 0 && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 className="font-semibold text-red-900 dark:text-red-300 mb-2">💡 개선 제안</h4>
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
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">🔒 강력한 비밀번호 팁</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• 최소 12자 이상 사용 (16자 이상 권장)</li>
            <li>• 대문자, 소문자, 숫자, 특수문자를 모두 포함</li>
            <li>• 개인 정보(이름, 생일 등)를 사용하지 말 것</li>
            <li>• 사이트마다 다른 비밀번호 사용</li>
            <li>• 비밀번호 관리자 사용 권장</li>
          </ul>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            ℹ️ 모든 분석은 브라우저에서만 수행되며 서버로 전송되지 않습니다
          </p>
        </div>
      </div>
    </ToolCard>
  )
}
