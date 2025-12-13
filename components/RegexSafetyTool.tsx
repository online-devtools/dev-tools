'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function RegexSafetyTool() {
  const { t } = useLanguage()
  // 패턴, 플래그, 결과 메시지를 상태로 관리합니다.
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [report, setReport] = useState('')

  const analyze = () => {
    const warnings: string[] = []

    if (!pattern) {
      setReport(t('regexSafety.error.required'))
      return
    }

    // 단순 휴리스틱: 중첩된 수량자, 역참조 없는 캡처 과다, 길이 긴 lookbehind 등
    if (pattern.match(/\(.*\*\+|\(.*\+\+\)/)) {
      warnings.push(t('regexSafety.warn.catastrophic'))
    }
    if ((pattern.match(/\(/g) || []).length > 10) {
      warnings.push(t('regexSafety.warn.groups'))
    }
    if (pattern.includes('.*.*')) {
      warnings.push(t('regexSafety.warn.greedy'))
    }
    if (pattern.match(/\(\?<?[=!]/) && pattern.length > 200) {
      warnings.push(t('regexSafety.warn.lookaround'))
    }
    if (flags.includes('g') && flags.includes('y')) {
      warnings.push(t('regexSafety.warn.flags'))
    }

    if (warnings.length === 0) {
      setReport(t('regexSafety.result.safe'))
      return
    }

    setReport(warnings.map((w, i) => `${i + 1}. ${w}`).join('\n'))
  }

  return (
    <ToolCard
      title={`🛡️ ${t('regexSafety.title')}`}
      description={t('regexSafety.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={pattern}
          onChange={setPattern}
          label={t('regexSafety.input.pattern')}
          placeholder={t('regexSafety.input.placeholder')}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('regexSafety.input.flags')}</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <button
          onClick={analyze}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('regexSafety.actions.analyze')}
        </button>

        <TextAreaWithCopy
          value={report}
          readOnly
          label={t('regexSafety.result.label')}
          rows={6}
        />
      </div>
    </ToolCard>
  )
}
