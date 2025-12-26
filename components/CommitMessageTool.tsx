"use client"

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'
import { buildCommitMessage } from '@/utils/commitMessage'

const COMMIT_TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'chore',
]

export default function CommitMessageTool() {
  const { t } = useLanguage()
  // Store all inputs needed to build a conventional commit message.
  const [type, setType] = useState('feat')
  const [scope, setScope] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [breakingDescription, setBreakingDescription] = useState('')
  const [issueRefs, setIssueRefs] = useState('')
  const [gitmoji, setGitmoji] = useState('')

  const message = useMemo(() => {
    // Build the message whenever any input changes.
    const issueList = issueRefs
      .split(',')
      .map((ref) => ref.trim())
      .filter(Boolean)

    return buildCommitMessage({
      type,
      scope: scope.trim() || undefined,
      subject: subject.trim() || t('commitMessage.subject.placeholder'),
      body: body.trim() || undefined,
      breakingDescription: breakingDescription.trim() || undefined,
      issueReferences: issueList.length > 0 ? issueList : undefined,
      gitmoji: gitmoji.trim() || undefined,
    })
  }, [type, scope, subject, body, breakingDescription, issueRefs, gitmoji, t])

  const handleClear = () => {
    // Reset all fields to default values for a fresh template.
    setType('feat')
    setScope('')
    setSubject('')
    setBody('')
    setBreakingDescription('')
    setIssueRefs('')
    setGitmoji('')
  }

  return (
    <ToolCard
      title={`📝 ${t('commitMessage.title')}`}
      description={t('commitMessage.description')}
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('commitMessage.type.label')}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {COMMIT_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('commitMessage.scope.label')}
            </label>
            <input
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder={t('commitMessage.scope.placeholder')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('commitMessage.gitmoji.label')}
            </label>
            <input
              value={gitmoji}
              onChange={(e) => setGitmoji(e.target.value)}
              placeholder=":sparkles:"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('commitMessage.subject.label')}
          </label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t('commitMessage.subject.placeholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <TextAreaWithCopy
          value={body}
          onChange={setBody}
          label={t('commitMessage.body.label')}
          placeholder={t('commitMessage.body.placeholder')}
          rows={4}
        />

        <TextAreaWithCopy
          value={breakingDescription}
          onChange={setBreakingDescription}
          label={t('commitMessage.breaking.label')}
          placeholder={t('commitMessage.breaking.placeholder')}
          rows={3}
        />

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('commitMessage.issues.label')}
          </label>
          <input
            value={issueRefs}
            onChange={(e) => setIssueRefs(e.target.value)}
            placeholder={t('commitMessage.issues.placeholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleClear}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('commitMessage.actions.clear')}
          </button>
        </div>

        <TextAreaWithCopy
          value={message}
          readOnly
          label={t('commitMessage.output.label')}
          placeholder={t('commitMessage.output.placeholder')}
          rows={6}
        />
      </div>
    </ToolCard>
  )
}
