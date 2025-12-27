'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const updateLanguage = (nextLanguage: 'ko' | 'en') => {
    // Update the language state and persist it via the context setter.
    setLanguage(nextLanguage)
    // Reflect the language choice in the query string for shareable URLs.
    const url = new URL(window.location.href)
    if (nextLanguage === 'en') {
      url.searchParams.set('lang', 'en')
    } else {
      url.searchParams.delete('lang')
    }
    // Replace the URL without reloading so navigation stays client-side.
    window.history.replaceState({}, '', url.toString())
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => updateLanguage('ko')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          language === 'ko'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        한국어
      </button>
      <button
        onClick={() => updateLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        English
      </button>
    </div>
  )
}
