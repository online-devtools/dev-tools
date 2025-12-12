'use client'

import { useState, useEffect } from 'react'
import { totp, authenticator } from 'otplib'
import ToolCard from './ToolCard'
import { useLanguage } from '@/contexts/LanguageContext'

export default function OTPTool() {
  const { t } = useLanguage()
  // 시크릿/토큰/검증 입력과 현재 남은 시간을 상태로 관리해 번역된 메시지를 즉시 반영합니다.
  const [secret, setSecret] = useState('')
  const [token, setToken] = useState('')
  const [tokenError, setTokenError] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [verifyToken, setVerifyToken] = useState('')
  const [verifySecret, setVerifySecret] = useState('')
  const [verifyResult, setVerifyResult] = useState('')
  const [verifyStatus, setVerifyStatus] = useState<'success' | 'fail' | ''>('')

  const generateSecret = () => {
    const newSecret = authenticator.generateSecret()
    setSecret(newSecret)
  }

  const generateToken = () => {
    try {
      if (!secret) {
        setToken('')
        setTokenError(t('otp.error.secretMissing'))
        return
      }

      const otp = totp.generate(secret)
      setTokenError('')
      setToken(otp)
    } catch {
      setToken('')
      setTokenError(t('otp.error.generate'))
    }
  }

  const verifyOTP = () => {
    try {
      if (!verifySecret || !verifyToken) {
        setVerifyResult(t('otp.verify.error.required'))
        setVerifyStatus('fail')
        return
      }

      const isValid = totp.check(verifyToken, verifySecret)
      setVerifyResult(isValid ? t('otp.verify.success') : t('otp.verify.fail'))
      setVerifyStatus(isValid ? 'success' : 'fail')
    } catch {
      setVerifyResult(t('otp.verify.error.generic'))
      setVerifyStatus('fail')
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
          setTokenError('')
        } catch {
          // Ignore errors in auto-regeneration
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [secret])

  return (
    <ToolCard
      title={`⏱️ ${t('otp.title')}`}
      description={t('otp.description')}
    >
      <div className="space-y-6">
        {/* Generate OTP */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('otp.generate.title')}</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('otp.generate.secretLabel')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder={t('otp.generate.secretPlaceholder')}
              />
              <button
                onClick={generateSecret}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
              >
                {t('otp.generate.secretAction')}
              </button>
            </div>
          </div>

          <button
            onClick={generateToken}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('otp.generate.action')}
          </button>

          {token && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-500">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                  {token}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('otp.generate.remaining', { seconds: timeRemaining })}
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

          {tokenError && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
              {tokenError}
            </div>
          )}
        </div>

        {/* Verify OTP */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('otp.verify.title')}</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('otp.verify.secretLabel')}
            </label>
            <input
              type="text"
              value={verifySecret}
              onChange={(e) => setVerifySecret(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder={t('otp.verify.secretPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('otp.verify.tokenLabel')}
            </label>
            <input
              type="text"
              value={verifyToken}
              onChange={(e) => setVerifyToken(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder={t('otp.verify.tokenPlaceholder')}
              maxLength={6}
            />
          </div>

          <button
            onClick={verifyOTP}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('otp.verify.action')}
          </button>

          {verifyResult && (
            <div className={`p-3 rounded-lg text-center font-medium ${
              verifyStatus === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {verifyResult}
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{t('otp.info.title')}</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• {t('otp.info.bullet1')}</li>
            <li>• {t('otp.info.bullet2')}</li>
            <li>• {t('otp.info.bullet3')}</li>
            <li>• {t('otp.info.bullet4')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
