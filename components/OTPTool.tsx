'use client'

import { useState, useEffect } from 'react'
import { totp, authenticator } from 'otplib'
import ToolCard from './ToolCard'

export default function OTPTool() {
  const [secret, setSecret] = useState('')
  const [token, setToken] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [verifyToken, setVerifyToken] = useState('')
  const [verifySecret, setVerifySecret] = useState('')
  const [verifyResult, setVerifyResult] = useState('')

  const generateSecret = () => {
    const newSecret = authenticator.generateSecret()
    setSecret(newSecret)
  }

  const generateToken = () => {
    try {
      if (!secret) {
        setToken('먼저 시크릿 키를 생성하거나 입력해주세요.')
        return
      }

      const otp = totp.generate(secret)
      setToken(otp)
    } catch {
      setToken('토큰 생성 중 오류가 발생했습니다.')
    }
  }

  const verifyOTP = () => {
    try {
      if (!verifySecret || !verifyToken) {
        setVerifyResult('시크릿 키와 토큰을 모두 입력해주세요.')
        return
      }

      const isValid = totp.check(verifyToken, verifySecret)
      setVerifyResult(isValid ? '✅ 유효한 토큰입니다!' : '❌ 유효하지 않은 토큰입니다.')
    } catch {
      setVerifyResult('검증 중 오류가 발생했습니다.')
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = 30 - (Math.floor(Date.now() / 1000) % 30)
      setTimeRemaining(remaining)

      // Auto-regenerate token when time resets
      if (secret && remaining === 30) {
        try {
          const otp = totp.generate(secret)
          setToken(otp)
        } catch {
          // Ignore errors in auto-regeneration
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [secret])

  return (
    <ToolCard
      title="OTP Code Generator"
      description="시간 기반 일회용 비밀번호(TOTP)를 생성하고 검증합니다"
    >
      <div className="space-y-6">
        {/* Generate OTP */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">OTP 생성</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              시크릿 키 (Secret)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="시크릿 키 입력 또는 생성"
              />
              <button
                onClick={generateSecret}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
              >
                생성
              </button>
            </div>
          </div>

          <button
            onClick={generateToken}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            OTP 코드 생성
          </button>

          {token && !token.includes('오류') && !token.includes('먼저') && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-500">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                  {token}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {timeRemaining}초 후 갱신
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(timeRemaining / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {token && (token.includes('오류') || token.includes('먼저')) && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
              {token}
            </div>
          )}
        </div>

        {/* Verify OTP */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">OTP 검증</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              시크릿 키
            </label>
            <input
              type="text"
              value={verifySecret}
              onChange={(e) => setVerifySecret(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="시크릿 키 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              OTP 코드
            </label>
            <input
              type="text"
              value={verifyToken}
              onChange={(e) => setVerifyToken(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="6자리 OTP 코드 입력"
              maxLength={6}
            />
          </div>

          <button
            onClick={verifyOTP}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            검증
          </button>

          {verifyResult && (
            <div className={`p-3 rounded-lg text-center font-medium ${
              verifyResult.includes('✅')
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {verifyResult}
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">TOTP란?</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• 시간 기반 일회용 비밀번호 (Time-based OTP)</li>
            <li>• 30초마다 새로운 6자리 코드 생성</li>
            <li>• Google Authenticator, Authy 등과 호환</li>
            <li>• 2단계 인증(2FA)에 사용</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
