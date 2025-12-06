'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'

export default function EmailNormalizerTool() {
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
      title="Email Normalizer"
      description="이메일 주소를 정규화하고 중복을 제거합니다"
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label="이메일 입력 (한 줄에 하나씩)"
          placeholder="user.name+tag@gmail.com&#10;another.user@example.com"
        />

        <button
          onClick={normalize}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          정규화
        </button>

        <TextAreaWithCopy
          value={output}
          readOnly
          label="정규화된 이메일"
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">정규화 규칙</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• Gmail: 점(.) 제거, +태그 제거</li>
            <li>• Outlook/Hotmail: +태그 제거</li>
            <li>• Yahoo: 하이픈(-) 제거, +태그 제거</li>
            <li>• 모든 이메일: 소문자 변환, 중복 제거</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
