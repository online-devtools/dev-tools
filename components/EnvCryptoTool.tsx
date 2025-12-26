'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { EnvCryptoError, decryptEnv, encryptEnv } from '@/utils/envCrypto'

export default function EnvCryptoTool() {
  const { t } = useLanguage()
  // Track input, password, output, and error states for encryption/decryption.
  const [input, setInput] = useState('')
  const [password, setPassword] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleEncrypt = () => {
    try {
      setError('')
      // Encrypt .env values with the supplied password.
      const encrypted = encryptEnv(input, password)
      setOutput(encrypted)
    } catch (err) {
      if (err instanceof EnvCryptoError) {
        if (err.code === 'empty') {
          setError(t('envCrypto.error.empty'))
        } else if (err.code === 'missingPassword') {
          setError(t('envCrypto.error.password'))
        } else {
          setError(t('envCrypto.error.encrypt'))
        }
      } else {
        setError(t('envCrypto.error.unknown'))
      }
      setOutput('')
    }
  }

  const handleDecrypt = () => {
    try {
      setError('')
      // Decrypt any ENC:: payloads with the supplied password.
      const decrypted = decryptEnv(input, password)
      setOutput(decrypted)
    } catch (err) {
      if (err instanceof EnvCryptoError) {
        if (err.code === 'empty') {
          setError(t('envCrypto.error.empty'))
        } else if (err.code === 'missingPassword') {
          setError(t('envCrypto.error.password'))
        } else {
          setError(t('envCrypto.error.decrypt'))
        }
      } else {
        setError(t('envCrypto.error.unknown'))
      }
      setOutput('')
    }
  }

  const handleClear = () => {
    // Reset the form for a new encryption workflow.
    setInput('')
    setPassword('')
    setOutput('')
    setError('')
  }

  return (
    <ToolCard
      title={`🔐 ${t('envCrypto.title')}`}
      description={t('envCrypto.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('envCrypto.input.label')}
          placeholder={t('envCrypto.input.placeholder')}
          rows={10}
        />

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('envCrypto.password.label')}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('envCrypto.password.placeholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleEncrypt}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('envCrypto.actions.encrypt')}
          </button>
          <button
            onClick={handleDecrypt}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('envCrypto.actions.decrypt')}
          </button>
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('envCrypto.actions.clear')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('envCrypto.output.label')}
          placeholder={t('envCrypto.output.placeholder')}
          rows={10}
        />
      </div>
    </ToolCard>
  )
}
