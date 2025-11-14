'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'

const toolCategories = [
  {
    categoryKey: 'category.encoding',
    icon: '🔤',
    tools: [
      { nameKey: 'tool.base64', path: '/base64', icon: '🔤' },
      { nameKey: 'tool.url', path: '/url', icon: '🔗' },
    ]
  },
  {
    categoryKey: 'category.security',
    icon: '🔐',
    tools: [
      { nameKey: 'tool.jasypt', path: '/jasypt', icon: '🔐' },
      { nameKey: 'tool.hash', path: '/hash', icon: '🔒' },
      { nameKey: 'tool.password', path: '/password', icon: '🔑' },
    ]
  },
  {
    categoryKey: 'category.dataFormat',
    icon: '📋',
    tools: [
      { nameKey: 'tool.json', path: '/json', icon: '📋' },
      { nameKey: 'tool.jwt', path: '/jwt', icon: '🎫' },
      { nameKey: 'tool.sql', path: '/sql', icon: '🗃️' },
      { nameKey: 'tool.mybatis', path: '/mybatis', icon: '🐦' },
      { nameKey: 'tool.csv', path: '/csv', icon: '📊' },
      { nameKey: 'tool.html', path: '/html', icon: '🏷️' },
    ]
  },
  {
    categoryKey: 'category.generators',
    icon: '🆔',
    tools: [
      { nameKey: 'tool.uuid', path: '/uuid', icon: '🆔' },
      { nameKey: 'tool.qrcode', path: '/qrcode', icon: '📱' },
      { nameKey: 'tool.lorem', path: '/lorem', icon: '✏️' },
    ]
  },
  {
    categoryKey: 'category.converters',
    icon: '🔄',
    tools: [
      { nameKey: 'tool.timestamp', path: '/timestamp', icon: '🕐' },
      { nameKey: 'tool.color', path: '/color', icon: '🎨' },
      { nameKey: 'tool.case', path: '/case', icon: '📝' },
      { nameKey: 'tool.baseconv', path: '/baseconv', icon: '🔢' },
    ]
  },
  {
    categoryKey: 'category.linux',
    icon: '🐧',
    tools: [
      { nameKey: 'tool.chmod', path: '/chmod', icon: '🔐' },
      { nameKey: 'tool.regex', path: '/regex', icon: '🔍' },
      { nameKey: 'tool.cron', path: '/cron', icon: '⏰' },
    ]
  },
  {
    categoryKey: 'category.network',
    icon: '🌐',
    tools: [
      { nameKey: 'tool.ipcalc', path: '/ipcalc', icon: '🌐' },
      { nameKey: 'tool.diff', path: '/diff', icon: '📄' },
    ]
  }
]

export default function Navigation() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              🛠️ Dev Tools
            </span>
          </Link>

          {/* Desktop: Category Dropdowns + Language Switcher */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {toolCategories.map((category) => (
              <div
                key={category.categoryKey}
                className="relative"
                onMouseEnter={() => setOpenDropdown(category.categoryKey)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <span>{category.icon}</span>
                  <span>{t(category.categoryKey)}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {openDropdown === category.categoryKey && (
                  <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[200px] z-50">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.path}
                        href={tool.path}
                        className={`block px-4 py-2 text-sm transition-colors ${
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
            <LanguageSwitcher />
          </div>

          {/* Mobile: Menu button + Language Switcher */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu - Accordion style */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {toolCategories.map((category) => (
              <div key={category.categoryKey} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                <button
                  onClick={() => setOpenDropdown(openDropdown === category.categoryKey ? null : category.categoryKey)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{t(category.categoryKey)}</span>
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${openDropdown === category.categoryKey ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openDropdown === category.categoryKey && (
                  <div className="pl-4 pb-2 space-y-1">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.path}
                        href={tool.path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
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
          </div>
        )}
      </div>
    </nav>
  )
}
