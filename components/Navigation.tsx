'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const tools = [
  { name: 'Base64', path: '/base64', icon: '🔤' },
  { name: 'URL Encode', path: '/url', icon: '🔗' },
  { name: 'Jasypt', path: '/jasypt', icon: '🔐' },
  { name: 'JSON', path: '/json', icon: '📋' },
  { name: 'JWT', path: '/jwt', icon: '🎫' },
  { name: 'SQL', path: '/sql', icon: '🗃️' },
  { name: 'MyBatis', path: '/mybatis', icon: '🐦' },
  { name: 'CSV/JSON', path: '/csv', icon: '📊' },
  { name: 'Cron', path: '/cron', icon: '⏰' },
  { name: 'Timestamp', path: '/timestamp', icon: '🕐' },
  { name: 'UUID', path: '/uuid', icon: '🆔' },
  { name: 'Hash', path: '/hash', icon: '🔒' },
  { name: 'Regex', path: '/regex', icon: '🔍' },
  { name: 'Color', path: '/color', icon: '🎨' },
  { name: 'Diff', path: '/diff', icon: '📄' },
  { name: 'QR Code', path: '/qrcode', icon: '📱' },
  { name: 'Case Convert', path: '/case', icon: '📝' },
  { name: 'HTML/XML', path: '/html', icon: '🏷️' },
  { name: 'Lorem Ipsum', path: '/lorem', icon: '✏️' },
]

export default function Navigation() {
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

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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

          {/* Desktop menu */}
          <div className="hidden md:flex md:flex-wrap md:gap-2 md:max-w-4xl">
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
                {tool.name}
              </Link>
            ))}
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
                {tool.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
