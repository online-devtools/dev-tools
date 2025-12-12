'use client'

import { useState } from 'react'
import CryptoJS from 'crypto-js'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HMACTool() {
  const { t } = useLanguage()
  // 메시지/시크릿/알고리즘 상태를 관리하며 HMAC 생성 결과를 번역된 UI로 제공합니다.
  const [message, setMessage] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [algorithm, setAlgorithm] = useState('SHA256')
  const [output, setOutput] = useState('')

  const generateHMAC = () => {
    try {
      if (!message || !secretKey) {
        setOutput(t('hmac.error.required'))
        return
      }

      let hmac = ''
      switch (algorithm) {
        case 'MD5':
          hmac = CryptoJS.HmacMD5(message, secretKey).toString()
          break
        case 'SHA1':
          hmac = CryptoJS.HmacSHA1(message, secretKey).toString()
          break
        case 'SHA256':
          hmac = CryptoJS.HmacSHA256(message, secretKey).toString()
          break
        case 'SHA512':
          hmac = CryptoJS.HmacSHA512(message, secretKey).toString()
          break
        default:
          hmac = CryptoJS.HmacSHA256(message, secretKey).toString()
      }

      setOutput(hmac)
    } catch (error) {
      setOutput(t('hmac.error.generate'))
    }
  }

  return (
    <ToolCard
      title={`🔐 ${t('hmac.title')}`}
      description={t('hmac.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={message}
          onChange={setMessage}
          label={t('hmac.message')}
          placeholder={t('hmac.messagePlaceholder')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('hmac.secret')}
          </label>
          <input
            type="text"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder={t('hmac.secretPlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('hmac.algorithm')}
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="MD5">HMAC-MD5</option>
            <option value="SHA1">HMAC-SHA1</option>
            <option value="SHA256">HMAC-SHA256</option>
            <option value="SHA512">HMAC-SHA512</option>
          </select>
        </div>

        <button
          onClick={generateHMAC}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('hmac.actions.generate')}
        </button>

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('hmac.result.label')}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{t('hmac.info.title')}</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• {t('hmac.info.bullet1')}</li>
            <li>• {t('hmac.info.bullet2')}</li>
            <li>• {t('hmac.info.bullet3')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
