'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { toolCategories } from '@/config/tools'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [openCategories, setOpenCategories] = useState<string[]>([])

  const toggleCategory = (categoryKey: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryKey)
        ? prev.filter(k => k !== categoryKey)
        : [...prev, categoryKey]
    )
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 mb-6" onClick={onClose}>
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              🛠️ Dev Tools
            </span>
          </Link>

          {/* Categories */}
          <nav className="space-y-1">
            {toolCategories.map((category) => (
              <div key={category.categoryKey}>
                <button
                  onClick={() => toggleCategory(category.categoryKey)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{t(category.categoryKey)}</span>
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      openCategories.includes(category.categoryKey) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Tools in category */}
                {openCategories.includes(category.categoryKey) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.path}
                        href={tool.path}
                        onClick={onClose}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          pathname === tool.path
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="mr-2">{tool.icon}</span>
                        {t(tool.nameKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Additional pages */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 space-y-1">
              <Link
                href="/snippets"
                onClick={onClose}
                className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                  pathname === '/snippets'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {t('nav.snippets')}
              </Link>
              <Link
                href="/faq"
                onClick={onClose}
                className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                  pathname === '/faq'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {t('nav.faq')}
              </Link>
              <Link
                href="/changelog"
                onClick={onClose}
                className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                  pathname === '/changelog'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {t('nav.changelog')}
              </Link>
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}
