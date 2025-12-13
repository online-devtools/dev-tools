'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSearch } from '@/contexts/SearchContext'
import { useFavorites } from '@/contexts/FavoritesContext'
import { toolCategories } from '@/config/tools'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useLanguage()
  const { searchQuery } = useSearch()
  const { favorites, recentTools, toggleFavorite, addToRecent, isFavorite } = useFavorites()
  const pathname = usePathname()
  // 카테고리 접힘 상태를 관리합니다. 기본은 모두 펼침으로 시작해 사용자가 토글할 수 있게 합니다.
  const [openCategories, setOpenCategories] = useState<string[]>(toolCategories.map((c) => c.categoryKey))

  const toggleCategory = (categoryKey: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryKey)
        ? prev.filter((k) => k !== categoryKey)
        : [...prev, categoryKey]
    )
  }
  // Filter tools based on search query (searches both Korean and English)
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return toolCategories
    }

    const query = searchQuery.toLowerCase()

    return toolCategories
      .map(category => {
        const filteredTools = category.tools.filter(tool => {
          const toolName = t(tool.nameKey).toLowerCase()
          const categoryName = t(category.categoryKey).toLowerCase()
          // Search in tool name and category name
          return toolName.includes(query) || categoryName.includes(query)
        })

        return {
          ...category,
          tools: filteredTools
        }
      })
      .filter(category => category.tools.length > 0)
  }, [searchQuery, t])

  // 검색 중에는 매칭된 카테고리를 모두 펼칩니다.
  useEffect(() => {
    if (searchQuery.trim()) {
      setOpenCategories(filteredCategories.map((c) => c.categoryKey))
    }
  }, [searchQuery, filteredCategories])

  // Add current page to recent tools
  useEffect(() => {
    if (pathname && pathname !== '/' && pathname !== '/about' && pathname !== '/contact' &&
        pathname !== '/privacy' && pathname !== '/terms' && pathname !== '/faq' &&
        pathname !== '/snippets' && pathname !== '/changelog') {
      addToRecent(pathname)
    }
  }, [pathname, addToRecent])

  // Helper function to get tool info by path
  const getToolInfo = (path: string) => {
    for (const category of toolCategories) {
      const tool = category.tools.find(t => t.path === path)
      if (tool) {
        return { tool, category }
      }
    }
    return null
  }

  // Get favorite and recent tool objects
  const favoriteTools = favorites.map(path => getToolInfo(path)).filter(Boolean)
  const recentToolsInfo = recentTools.map(path => getToolInfo(path)).filter(Boolean)

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

          {/* Favorites Section */}
          {!searchQuery && favoriteTools.length > 0 && (
            <div className="mb-4">
              <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ⭐ {t('sidebar.favorites')}
              </h3>
              <div className="space-y-1">
                {favoriteTools.map((info) => {
                  if (!info) return null
                  const { tool } = info
                  return (
                    <div key={tool.path} className="flex items-center group">
                      <Link
                        href={tool.path}
                        onClick={onClose}
                        className={`flex-1 flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                          pathname === tool.path
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="mr-2">{tool.icon}</span>
                        {t(tool.nameKey)}
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(tool.path)
                        }}
                        className="p-2 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove from favorites"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Recent Tools Section */}
          {!searchQuery && recentToolsInfo.length > 0 && (
            <div className="mb-4">
              <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                🕐 {t('sidebar.recent')}
              </h3>
              <div className="space-y-1">
                {recentToolsInfo.map((info) => {
                  if (!info) return null
                  const { tool } = info
                  return (
                    <div key={tool.path} className="flex items-center group">
                      <Link
                        href={tool.path}
                        onClick={onClose}
                        className={`flex-1 flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                          pathname === tool.path
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="mr-2">{tool.icon}</span>
                        {t(tool.nameKey)}
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(tool.path)
                        }}
                        className={`p-2 transition-opacity ${
                          isFavorite(tool.path) ? 'text-yellow-500' : 'text-gray-400 opacity-0 group-hover:opacity-100'
                        }`}
                        aria-label={isFavorite(tool.path) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          {isFavorite(tool.path) ? (
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          ) : (
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" stroke="currentColor" fill="none" />
                          )}
                        </svg>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Divider */}
          {!searchQuery && (favoriteTools.length > 0 || recentToolsInfo.length > 0) && (
            <div className="border-t border-gray-200 dark:border-gray-700 mb-4" />
          )}

          {/* Categories */}
          <nav className="space-y-1">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div key={category.categoryKey}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.categoryKey)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-expanded={openCategories.includes(category.categoryKey)}
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
                        <div key={tool.path} className="flex items-center group">
                          <Link
                            href={tool.path}
                            onClick={onClose}
                            className={`flex-1 flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                              pathname === tool.path
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <span className="mr-2">{tool.icon}</span>
                            {t(tool.nameKey)}
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(tool.path)
                            }}
                            className={`p-2 transition-opacity ${
                              isFavorite(tool.path) ? 'text-yellow-500' : 'text-gray-400 opacity-0 group-hover:opacity-100'
                            }`}
                            aria-label={isFavorite(tool.path) ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              {isFavorite(tool.path) ? (
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              ) : (
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" stroke="currentColor" fill="none" />
                              )}
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                {t('search.noResults')}
              </div>
            )}

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
