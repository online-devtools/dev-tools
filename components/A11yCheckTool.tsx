'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type Issue = { type: string; detail: string }

export default function A11yCheckTool() {
  const { t } = useLanguage()
  // HTML 입력과 검사 결과를 상태로 관리합니다.
  const [input, setInput] = useState('')
  const [issues, setIssues] = useState<Issue[]>([])

  const checkA11y = () => {
    const list: Issue[] = []
    const doc = new DOMParser().parseFromString(input, 'text/html')
    doc.querySelectorAll('img').forEach((img) => {
      if (!img.getAttribute('alt')) {
        list.push({ type: 'alt', detail: t('a11y.issue.imgAlt') })
      }
    })
    doc.querySelectorAll('input,textarea,select').forEach((el) => {
      const hasLabel = !!doc.querySelector(`label[for="${(el as HTMLElement).id}"]`)
      const hasAria = !!el.getAttribute('aria-label') || !!el.getAttribute('aria-labelledby')
      if (!hasLabel && !hasAria) {
        list.push({ type: 'label', detail: t('a11y.issue.formLabel') })
      }
    })
    doc.querySelectorAll('a').forEach((a) => {
      if (!a.textContent?.trim()) {
        list.push({ type: 'link', detail: t('a11y.issue.linkText') })
      }
    })

    const headings = Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) => parseInt(h.tagName.substring(1), 10))
    for (let i = 1; i < headings.length; i++) {
      if (headings[i] - headings[i - 1] > 1) {
        list.push({ type: 'heading', detail: t('a11y.issue.headingOrder') })
        break
      }
    }

    setIssues(list)
  }

  return (
    <ToolCard
      title={`♿ ${t('a11y.title')}`}
      description={t('a11y.description')}
    >
      <div className="space-y-4">
        <TextAreaWithCopy
          value={input}
          onChange={setInput}
          label={t('a11y.input.label')}
          placeholder={t('a11y.input.placeholder')}
          rows={8}
        />

        <button
          onClick={checkA11y}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('a11y.actions.check')}
        </button>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            {t('a11y.result.title', { count: issues.length })}
          </h3>
          {issues.length === 0 ? (
            <p className="text-sm text-green-700 dark:text-green-300">{t('a11y.result.none')}</p>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {issues.map((issue, idx) => (
                <li key={`${issue.type}-${idx}`}>{issue.detail}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ToolCard>
  )
}
