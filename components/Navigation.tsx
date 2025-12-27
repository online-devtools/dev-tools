'use client'

import { useEffect, useRef } from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useSearch } from '@/contexts/SearchContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface NavigationProps {
  onToggleSidebar: () => void
}

export default function Navigation({ onToggleSidebar }: NavigationProps) {
  const { searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen } = useSearch()
  const { language, t } = useLanguage()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
        searchInputRef.current?.focus()
      }
      // ESC to close search
      if (e.key === 'Escape' && isSearchOpen) {
        setSearchQuery('')
        setIsSearchOpen(false)
        searchInputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, setIsSearchOpen, setSearchQuery])

  // 현재 선택된 언어에 맞춰 검색 입력 안내 문구를 구성한다.
  const placeholder = language === 'ko' ? '도구 검색... (Ctrl+K)' : 'Search tools... (Ctrl+K)'
  // 후원 버튼 라벨은 i18n 키에서 가져와 텍스트와 접근성 라벨을 동시에 맞춘다.
  const buyMeCoffeeLabel = t('nav.buyMeCoffee')

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Theme Toggle and Language Switcher */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {/* Buy Me a Coffee 버튼은 외부 후원 페이지로 이동시키는 헤더 액션이다. */}
            <a
              href="https://www.buymeacoffee.com/dlrbgns090p"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={buyMeCoffeeLabel}
              className="inline-flex items-center gap-2 rounded-full bg-[#FFDD00] px-3 py-2 text-xs font-semibold text-black shadow-sm transition hover:bg-[#ffd43b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFDD00] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800"
            >
              {/* 아이콘은 장식 요소이므로 스크린 리더에서는 숨긴다. */}
              <span aria-hidden="true">☕</span>
              {/* 좁은 화면에서는 텍스트를 숨겨 레이아웃 깨짐을 방지한다. */}
              <span className="hidden sm:inline">{buyMeCoffeeLabel}</span>
            </a>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}
