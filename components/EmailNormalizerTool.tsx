'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function EmailNormalizerTool() {
  const { t } = useLanguage()
  // 입력 이메일 목록과 정규화 결과를 상태로 관리해 중복 제거 후 번역된 결과를 보여줍니다.
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const normalizeEmail = (email: string): string => {
    try {
      // Trim and lowercase
      email = email.trim().toLowerCase()

      // Split into local and domain parts
      const [local, domain] = email.split('@')
      if (!local || !domain) return email

      let normalizedLocal = local

      // Gmail: remove dots and plus addressing
      if (domain === 'gmail.com' || domain === 'googlemail.com') {
        normalizedLocal = local.replace(/\./g, '').split('+')[0]
      }
      // Outlook/Hotmail: remove plus addressing
      else if (domain.includes('outlook.') || domain.includes('hotmail.') || domain.includes('live.')) {
        normalizedLocal = local.split('+')[0]
      }
      // Yahoo: remove hyphens and plus addressing
      else if (domain.includes('yahoo.') || domain.includes('ymail.') || domain.includes('rocketmail.')) {
        normalizedLocal = local.replace(/-/g, '').split('+')[0]
      }
      // Others: just remove plus addressing
      else {
        normalizedLocal = local.split('+')[0]
      }

      return `${normalizedLocal}@${domain}`
    } catch {
      return email
    }
  }

  const normalize = () => {
    const emails = input.split('\n').filter(e => e.trim())
    const normalized = emails.map(email => normalizeEmail(email))
    const unique = [...new Set(normalized)]
    setOutput(unique.join('\n'))
  }

  return (
    <ToolCard
      title={`📧 ${t('emailNormalizer.title')}`}
      description={t('emailNormalizer.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('emailNormalizer.input.label')}
          placeholder={t('emailNormalizer.input.placeholder')}
        />

        <button
          onClick={normalize}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('emailNormalizer.actions.normalize')}
        </button>

        <TextAreaWithCopy
          value={output}
          readOnly
          label={t('emailNormalizer.output.label')}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{t('emailNormalizer.rules.title')}</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• {t('emailNormalizer.rules.gmail')}</li>
            <li>• {t('emailNormalizer.rules.outlook')}</li>
            <li>• {t('emailNormalizer.rules.yahoo')}</li>
            <li>• {t('emailNormalizer.rules.common')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
