'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'

const tools = [
  { nameKey: 'tool.base64', path: '/base64', icon: '🔤' },
  { nameKey: 'tool.url', path: '/url', icon: '🔗' },
  { nameKey: 'tool.jasypt', path: '/jasypt', icon: '🔐' },
  { nameKey: 'tool.json', path: '/json', icon: '📋' },
  { nameKey: 'tool.jwt', path: '/jwt', icon: '🎫' },
  { nameKey: 'tool.sql', path: '/sql', icon: '🗃️' },
  { nameKey: 'tool.mybatis', path: '/mybatis', icon: '🐦' },
  { nameKey: 'tool.csv', path: '/csv', icon: '📊' },
  { nameKey: 'tool.cron', path: '/cron', icon: '⏰' },
  { nameKey: 'tool.timestamp', path: '/timestamp', icon: '🕐' },
  { nameKey: 'tool.uuid', path: '/uuid', icon: '🆔' },
  { nameKey: 'tool.hash', path: '/hash', icon: '🔒' },
  { nameKey: 'tool.regex', path: '/regex', icon: '🔍' },
  { nameKey: 'tool.color', path: '/color', icon: '🎨' },
  { nameKey: 'tool.diff', path: '/diff', icon: '📄' },
  { nameKey: 'tool.qrcode', path: '/qrcode', icon: '📱' },
  { nameKey: 'tool.case', path: '/case', icon: '📝' },
  { nameKey: 'tool.html', path: '/html', icon: '🏷️' },
  { nameKey: 'tool.lorem', path: '/lorem', icon: '✏️' },
]

export default function Navigation() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              🛠️ Dev Tools
            </span>
          </Link>

          {/* Desktop: Tools + Language Switcher */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <div className="flex flex-wrap gap-2 max-w-4xl">
              {tools.map((tool) => (
                <Link
                  key={tool.path}
                  href={tool.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === tool.path
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-1">{tool.icon}</span>
                  {t(tool.nameKey)}
                </Link>
              ))}
            </div>
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

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 grid grid-cols-2 gap-2">
            {tools.map((tool) => (
              <Link
                key={tool.path}
                href={tool.path}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === tool.path
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-1">{tool.icon}</span>
                {t(tool.nameKey)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
