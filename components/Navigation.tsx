'use client'

import LanguageSwitcher from './LanguageSwitcher'

interface NavigationProps {
  onToggleSidebar: () => void
}

export default function Navigation({ onToggleSidebar }: NavigationProps) {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
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

          {/* Language Switcher */}
          <div className="ml-auto">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}
