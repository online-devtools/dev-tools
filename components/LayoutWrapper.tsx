'use client'

import { useState } from 'react'
import Navigation from './Navigation'
import Sidebar from './Sidebar'
import AdBlockDetector from './AdBlockDetector'
import CoupangAd from './CoupangAd'
import { SearchProvider } from '@/contexts/SearchContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <ThemeProvider>
      <SearchProvider>
        <FavoritesProvider>
          {/* AdBlock Detector - 전체 화면 오버레이 */}
          <AdBlockDetector />

          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64 overflow-hidden">
              {/* Navigation */}
              <Navigation onToggleSidebar={toggleSidebar} />

              {/* Page Content */}
              <main className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {children}
                {/* Coupang Partners Ad */}
                <CoupangAd />
              </main>
            </div>
          </div>
        </FavoritesProvider>
      </SearchProvider>
    </ThemeProvider>
  )
}
