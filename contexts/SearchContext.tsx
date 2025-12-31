'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

/**
 * SearchProvider 컴포넌트
 *
 * 전역 검색 상태를 관리합니다.
 * - URL의 ?search= 파라미터를 읽어 검색 상태 초기화
 * - Google Sitelinks 검색창과 연동
 * - 검색어 변경 시 URL 업데이트 (히스토리 관리)
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQueryState] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // URL의 ?search= 파라미터를 읽어 검색 상태 초기화
  // Google Sitelinks 검색창에서 유입된 검색어 처리
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchQueryState(searchFromUrl)
      setIsSearchOpen(true)
    }
  }, [searchParams])

  // 검색어 변경 핸들러
  // 검색어가 있으면 URL에 ?search= 파라미터 추가
  const setSearchQuery = (query: string) => {
    setSearchQueryState(query)

    // 홈페이지에서만 URL 파라미터 업데이트
    if (pathname === '/' || pathname.match(/^\/(ko|en|ja|pt|de)$/)) {
      if (query) {
        // 검색어가 있으면 URL에 추가
        router.replace(`${pathname}?search=${encodeURIComponent(query)}`, { scroll: false })
      } else {
        // 검색어가 비어있으면 파라미터 제거
        router.replace(pathname, { scroll: false })
      }
    }
  }

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
