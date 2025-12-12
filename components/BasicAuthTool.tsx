'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function BasicAuthTool() {
  const { t } = useLanguage()
  // 사용자명/비밀번호 입력과 결과 헤더 상태를 관리해 번역된 안내를 제공합니다.
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [output, setOutput] = useState('')

  const generate = () => {
    if (!username || !password) {
      setOutput(t('basicAuth.error.required'))
      return
    }

    const credentials = `${username}:${password}`
    const base64 = btoa(credentials)
    const header = `Basic ${base64}`

    setOutput(header)
  }

  const decode = (header: string) => {
    try {
      const base64 = header.replace(/^Basic\s+/, '')
      const decoded = atob(base64)
      const [user, pass] = decoded.split(':')
      setUsername(user || '')
      setPassword(pass || '')
      setOutput(header)
    } catch (err) {
      setOutput(t('basicAuth.error.invalidHeader'))
    }
  }

  return (
    <ToolCard
      title={`🔑 ${t('basicAuth.title')}`}
      description={t('basicAuth.description')}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('basicAuth.username')}
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder={t('basicAuth.usernamePlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('basicAuth.password')}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder={t('basicAuth.passwordPlaceholder')}
          />
        </div>

        <button
          onClick={generate}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('basicAuth.actions.generate')}
        </button>

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('basicAuth.output.label')}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{t('basicAuth.howto.title')}</h3>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <div>• {t('basicAuth.howto.header', { header: output || 'Basic <base64>' })}</div>
            <div>• {t('basicAuth.howto.curl', { header: output || 'Basic <base64>' })}</div>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
