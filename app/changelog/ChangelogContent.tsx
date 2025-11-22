'use client'

import { useLanguage } from '@/contexts/LanguageContext'

const entries = [
  {
    titleKey: 'changelog.entry1.title',
    descKey: 'changelog.entry1.desc',
    date: '2025-01-23',
  },
  {
    titleKey: 'changelog.entry2.title',
    descKey: 'changelog.entry2.desc',
    date: '2025-01-22',
  },
  {
    titleKey: 'changelog.entry3.title',
    descKey: 'changelog.entry3.desc',
    date: '2025-01-22',
  },
  {
    titleKey: 'changelog.entry4.title',
    descKey: 'changelog.entry4.desc',
    date: '2025-01-21',
  },
  {
    titleKey: 'changelog.entry5.title',
    descKey: 'changelog.entry5.desc',
    date: '2025-01-18',
  },
  {
    titleKey: 'changelog.entry6.title',
    descKey: 'changelog.entry6.desc',
    date: '2025-01-15',
  },
  {
    titleKey: 'changelog.entry7.title',
    descKey: 'changelog.entry7.desc',
    date: '2025-01-12',
  },
  {
    titleKey: 'changelog.entry8.title',
    descKey: 'changelog.entry8.desc',
    date: '2025-01-10',
  },
  {
    titleKey: 'changelog.entry9.title',
    descKey: 'changelog.entry9.desc',
    date: '2025-01-08',
  },
  {
    titleKey: 'changelog.entry10.title',
    descKey: 'changelog.entry10.desc',
    date: '2025-01-05',
  },
  {
    titleKey: 'changelog.entry11.title',
    descKey: 'changelog.entry11.desc',
    date: '2025-01-03',
  },
  {
    titleKey: 'changelog.entry12.title',
    descKey: 'changelog.entry12.desc',
    date: '2025-01-01',
  },
]

export default function ChangelogContent() {
  const { t } = useLanguage()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8">
        <p className="inline-flex items-center text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-2">
          {t('nav.changelog')}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {t('changelog.title')}
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          {t('changelog.subtitle')}
        </p>
      </section>

      <section className="space-y-4">
        {entries.map((entry) => (
          <article
            key={entry.titleKey}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t(entry.titleKey)}
              </h2>
              <span className="text-xs text-gray-500">{entry.date}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              {t(entry.descKey)}
            </p>
          </article>
        ))}
      </section>
    </div>
  )
}
