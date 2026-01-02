'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE,
  SupportedLanguage,
  getLanguageFromPathname,
  isSupportedLanguage,
} from '@/utils/i18n'
import { translations } from '@/config/translations'

type Language = SupportedLanguage

type TranslationReplacements = Record<string, string | number>

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, replacements?: TranslationReplacements) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)


export function LanguageProvider({
  children,
  initialLanguage = DEFAULT_LANGUAGE,
}: {
  children: React.ReactNode
  initialLanguage?: Language
}) {
  // Initialize from the server-provided language when available, defaulting to Korean.
  const [language, setLanguageState] = useState<Language>(initialLanguage)
  const pathname = usePathname()

  // Persist language across reloads via localStorage + cookie so middleware can read it.
  const persistLanguage = useCallback((nextLanguage: Language) => {
    // localStorage와 쿠키를 동일한 값으로 맞춰 서버/클라이언트가 같은 언어를 사용하게 한다.
    localStorage.setItem('language', nextLanguage)
    document.cookie = `${LANGUAGE_COOKIE}=${nextLanguage}; path=/; max-age=31536000`
  }, [])

  useEffect(() => {
    // 언어 결정 우선순위:
    // 1) URL 경로의 언어 프리픽스 (/ko, /en, /ja, /pt, /de)
    // 2) localStorage에 저장된 사용자 선택 언어
    // 3) 브라우저 locale
    const languageFromPath = getLanguageFromPathname(pathname)
    const savedLang = localStorage.getItem('language')
    const normalizedSaved = isSupportedLanguage(savedLang) ? savedLang : null
    const browserLang = navigator.language.toLowerCase()
    const browserFallback = (() => {
      // 브라우저 locale을 지원 언어로 매핑해 기본 언어를 결정한다.
      if (browserLang.startsWith('ko')) return 'ko'
      if (browserLang.startsWith('ja')) return 'ja'
      if (browserLang.startsWith('pt')) return 'pt'
      if (browserLang.startsWith('de')) return 'de'
      return 'en'
    })()

    const nextLanguage = languageFromPath ?? normalizedSaved ?? browserFallback

    // 경로가 바뀔 때만 언어를 동기화해 언어 전환 시 깜박임을 줄인다.
    setLanguageState((current) => (current === nextLanguage ? current : nextLanguage))

    // 저장된 값과 다를 때만 persist 처리해 불필요한 쓰기를 줄인다.
    if (savedLang !== nextLanguage) {
      persistLanguage(nextLanguage)
    }
  }, [pathname, persistLanguage])

  useEffect(() => {
    // <html lang> 값을 현재 언어와 동기화하면 스크린리더/검색엔진이 언어를 정확히 인식한다.
    const htmlLangMap: Record<Language, string> = {
      ko: 'ko-KR',
      en: 'en-US',
      ja: 'ja-JP',
      pt: 'pt-BR',
      de: 'de-DE',
    }
    const htmlLang = htmlLangMap[language]
    document.documentElement.lang = htmlLang
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    persistLanguage(lang)
  }

  // t() centralizes lookup + interpolation so every component consumes strings consistently.
  const t = (key: string, replacements?: TranslationReplacements): string => {
    // 현재 언어에 키가 없으면 영어를 fallback으로 사용한다.
    const template = translations[language][key] || translations.en[key] || key
    if (!replacements) {
      return template
    }

    return Object.entries(replacements).reduce((acc, [token, value]) => {
      const pattern = new RegExp(`{{\\s*${token}\\s*}}`, 'g')
      return acc.replace(pattern, String(value))
    }, template)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
