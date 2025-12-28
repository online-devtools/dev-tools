'use client'

import React, { useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { SupportedLanguage, buildLocalizedPathname } from '@/utils/i18n'

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  // Transition을 사용해 언어 변경 시 라우팅 작업을 비동기로 처리한다.
  const [isPending, startTransition] = useTransition()

  const updateLanguage = (nextLanguage: SupportedLanguage) => {
    // 현재 언어와 동일하면 불필요한 라우팅을 하지 않는다.
    if (nextLanguage === language) {
      return
    }

    // 언어 상태 변경과 라우팅을 하나의 transition으로 묶어 렌더링 버벅임을 줄인다.
    startTransition(() => {
      // Update the language state and persist it via the context setter.
      setLanguage(nextLanguage)

      // Preserve existing query parameters while swapping the locale prefix.
      const nextPath = buildLocalizedPathname(pathname, nextLanguage)
      const query = searchParams.toString()
      const nextUrl = query ? `${nextPath}?${query}` : nextPath

      // Use client navigation so the UI updates without a full reload.
      router.replace(nextUrl)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-semibold text-gray-600 dark:text-gray-300" htmlFor="language-select">
        {t('language.label')}
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(event) => updateLanguage(event.target.value as SupportedLanguage)}
        disabled={isPending}
        className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={t('language.label')}
      >
        <option value="ko">{t('language.ko')}</option>
        <option value="en">{t('language.en')}</option>
        <option value="ja">{t('language.ja')}</option>
        <option value="pt">{t('language.pt')}</option>
        <option value="de">{t('language.de')}</option>
      </select>
      {isPending && (
        <span className="text-[10px] text-gray-500 dark:text-gray-400">
          {t('language.loading')}
        </span>
      )}
    </div>
  )
}
