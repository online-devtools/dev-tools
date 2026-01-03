'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { toolCategories } from '@/config/tools'

export default function Breadcrumbs() {
    const pathname = usePathname()
    const { t, language } = useLanguage()

    // Remove language prefix if present
    const cleanPath = pathname.replace(/^\/(ko|en)/, '') || '/'

    // Don't show on home page
    if (cleanPath === '/') return null

    // Find current tool and category
    const category = toolCategories.find(cat =>
        cat.tools.some(tool => tool.path === cleanPath)
    )

    const currentTool = category?.tools.find(tool => tool.path === cleanPath)

    if (!currentTool || !category) return null

    return (
        <nav className="flex mb-4 text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link
                        href={`/${language}`}
                        className="inline-flex items-center hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                        </svg>
                        Home
                    </Link>
                </li>
                <li>
                    <div className="flex items-center">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="ml-1 md:ml-2 font-medium">
                            {t(category.categoryKey)}
                        </span>
                    </div>
                </li>
                <li aria-current="page">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="ml-1 md:ml-2 font-medium text-gray-700 dark:text-gray-200">
                            {t(currentTool.nameKey)}
                        </span>
                    </div>
                </li>
            </ol>
        </nav>
    )
}
