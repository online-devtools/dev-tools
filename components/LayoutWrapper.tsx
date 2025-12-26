'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Navigation from './Navigation'
import Sidebar from './Sidebar'
import AdBlockDetector from './AdBlockDetector'
import CoupangAd from './CoupangAd'
import KakaoAd from './KakaoAd'
import { SearchProvider } from '@/contexts/SearchContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // Next.js App Router hook으로 현재 경로를 가져와 홈 전용 광고와 충돌하지 않게 한다.
  const pathname = usePathname()
  // 홈에서는 상단에 별도 광고 배치가 있으므로 전역 광고는 숨긴다.
  const isHomePage = pathname === '/'

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
                {/* Kakao Adfit - 320x100 */}
                <KakaoAd adUnit="DAN-3cGWSgJtH0Co8Hkh" width="320" height="100" />
                {/* Kakao Adfit - 300x250 */}
                <KakaoAd adUnit="DAN-IYphQBA4g414ByzT" width="300" height="250" />
                {/* Coupang Partners Ad (skip on home to avoid duplication with hero placement). */}
                {!isHomePage && <CoupangAd />}
              </main>
            </div>
          </div>
        </FavoritesProvider>
      </SearchProvider>
    </ThemeProvider>
  )
}
