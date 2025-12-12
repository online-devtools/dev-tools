'use client'

import { useState } from 'react'
import bcrypt from 'bcryptjs'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function BcryptTool() {
  const { t } = useLanguage()
  // State values capture inputs and outputs so translation-aware messaging renders with the latest values.
  const [password, setPassword] = useState('')
  const [rounds, setRounds] = useState('10')
  const [hash, setHash] = useState('')
  const [comparePassword, setComparePassword] = useState('')
  const [compareHash, setCompareHash] = useState('')
  const [compareResult, setCompareResult] = useState('')

  // Create a bcrypt hash after validating the password and cost factor.
  const generateHash = async () => {
    try {
      if (!password) {
        setHash(t('bcrypt.error.missingPassword'))
        return
      }

      const saltRounds = parseInt(rounds, 10)
      if (isNaN(saltRounds) || saltRounds < 4 || saltRounds > 16) {
        setHash(t('bcrypt.error.invalidRounds'))
        return
      }

      const hashed = await bcrypt.hash(password, saltRounds)
      setHash(hashed)
    } catch {
      setHash(t('bcrypt.error.hash'))
    }
  }

  // Compare a plain password and a bcrypt hash to confirm if they match.
  const comparePasswords = async () => {
    try {
      if (!comparePassword || !compareHash) {
        setCompareResult(t('bcrypt.compare.missingInput'))
        return
      }

      const isMatch = await bcrypt.compare(comparePassword, compareHash)
      setCompareResult(isMatch ? t('bcrypt.compare.success') : t('bcrypt.compare.fail'))
    } catch {
      setCompareResult(t('bcrypt.error.compare'))
    }
  }

  return (
    <ToolCard
      title={`🔐 ${t('tool.bcrypt')}`}
      description={t('bcrypt.description')}
    >
      <div className="space-y-6">
        {/* Hash Generation */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('bcrypt.hash.title')}
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('bcrypt.hash.passwordLabel')}
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder={t('bcrypt.hash.passwordPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('bcrypt.hash.roundsLabel')}
            </label>
            <input
              type="number"
              value={rounds}
              onChange={(e) => setRounds(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="4"
              max="16"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('bcrypt.hash.roundsHelp')}
            </p>
          </div>

          <button
            onClick={generateHash}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('bcrypt.hash.action')}
          </button>

          <TextAreaWithCopy
            value={hash}
            readOnly
            label={t('bcrypt.hash.resultLabel')}
          />
        </div>

        {/* Hash Comparison */}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('bcrypt.compare.title')}
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('bcrypt.compare.passwordLabel')}
            </label>
            <input
              type="text"
              value={comparePassword}
              onChange={(e) => setComparePassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder={t('bcrypt.compare.passwordPlaceholder')}
            />
          </div>

          <TextAreaWithCopy
            value={compareHash}
            onChange={setCompareHash}
            label={t('bcrypt.compare.hashLabel')}
            placeholder={t('bcrypt.compare.hashPlaceholder')}
          />

          <button
            onClick={comparePasswords}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('bcrypt.compare.action')}
          </button>

          {compareResult && (
            <div className={`p-3 rounded-lg text-center font-medium ${
              compareResult.includes('✅')
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {compareResult}
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  )
}
