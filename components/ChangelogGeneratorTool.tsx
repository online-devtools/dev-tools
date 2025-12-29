'use client'

import { useMemo, useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

type Group = {
  title: string
  items: string[]
}

const TYPE_TITLES: Record<string, string> = {
  feat: 'Features',
  fix: 'Fixes',
  docs: 'Docs',
  refactor: 'Refactor',
  perf: 'Performance',
  test: 'Tests',
  chore: 'Chore',
  ci: 'CI',
  build: 'Build',
}

const parseLines = (input: string) => {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.replace(/^[-*]\s+/, ''))
}

const parseConventional = (line: string) => {
  const match = line.match(/^(\w+)(?:\([^)]*\))?:\s*(.+)$/)
  if (!match) return null
  return { type: match[1], subject: match[2] }
}

export default function ChangelogGeneratorTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [version, setVersion] = useState('v1.0.0')
  const [date, setDate] = useState('')
  const [output, setOutput] = useState('')

  const generate = () => {
    const lines = parseLines(input)
    const groups: Record<string, Group> = {}
    const others: string[] = []

    lines.forEach((line) => {
      const parsed = parseConventional(line)
      if (parsed) {
        const title = TYPE_TITLES[parsed.type] || parsed.type
        if (!groups[title]) {
          groups[title] = { title, items: [] }
        }
        groups[title].items.push(parsed.subject)
      } else {
        others.push(line)
      }
    })

    const orderedGroups = Object.values(groups)
    if (others.length) {
      orderedGroups.push({ title: t('changelog.other'), items: others })
    }

    const headerDate = date ? ` (${date})` : ''
    const sections = orderedGroups
      .map((group) => `### ${group.title}\n${group.items.map((item) => `- ${item}`).join('\n')}`)
      .join('\n\n')

    setOutput(`## ${version}${headerDate}\n\n${sections}`)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  const hint = useMemo(() => {
    return t('changelog.hint')
  }, [t])

  return (
    <ToolCard title={`📝 ${t('changelog.title')}`} description={t('changelog.description')}>
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('changelog.version')}</label>
            <input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('changelog.date')}</label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="2025-01-01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('changelog.input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder={t('changelog.placeholder')}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-800 dark:text-gray-200"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400">{hint}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={generate} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            {t('changelog.generate')}
          </button>
          <button onClick={handleClear} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg">
            {t('changelog.clear')}
          </button>
        </div>

        {output && <TextAreaWithCopy value={output} readOnly rows={10} />}
      </div>
    </ToolCard>
  )
}
