'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { SupportedLanguage, buildLocalizedPathname } from '@/utils/i18n'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const updateLanguage = (nextLanguage: SupportedLanguage) => {
    // Update the language state and persist it via the context setter.
    setLanguage(nextLanguage)

    // Preserve existing query parameters while swapping the locale prefix.
    const nextPath = buildLocalizedPathname(pathname, nextLanguage)
    const query = searchParams.toString()
    const nextUrl = query ? `${nextPath}?${query}` : nextPath

    // Use client navigation so the UI updates without a full reload.
    router.push(nextUrl)
  }

  const buttonClass = (isActive: boolean) =>
    `px-2 py-1 rounded-md text-xs font-medium transition-colors ${
      isActive
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
    }`

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={() => updateLanguage('ko')} className={buttonClass(language === 'ko')}>
        한국어
      </button>
      <button onClick={() => updateLanguage('en')} className={buttonClass(language === 'en')}>
        English
      </button>
      <button onClick={() => updateLanguage('ja')} className={buttonClass(language === 'ja')}>
        日本語
      </button>
      <button onClick={() => updateLanguage('pt')} className={buttonClass(language === 'pt')}>
        Português
      </button>
      <button onClick={() => updateLanguage('de')} className={buttonClass(language === 'de')}>
        Deutsch
      </button>
    </div>
  )
}
