'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

// Tool configuration with translation keys
const toolsConfig = [
  {
    categoryKey: 'category.encoding',
    items: [
      { nameKey: 'tool.base64', path: '/base64', icon: '🔤', descKey: 'tool.base64.desc' },
      { nameKey: 'tool.url', path: '/url', icon: '🔗', descKey: 'tool.url.desc' },
    ]
  },
  {
    categoryKey: 'category.security',
    items: [
      { nameKey: 'tool.jasypt', path: '/jasypt', icon: '🔐', descKey: 'tool.jasypt.desc' },
      { nameKey: 'tool.hash', path: '/hash', icon: '🔒', descKey: 'tool.hash.desc' },
    ]
  },
  {
    categoryKey: 'category.dataFormat',
    items: [
      { nameKey: 'tool.json', path: '/json', icon: '📋', descKey: 'tool.json.desc' },
      { nameKey: 'tool.jwt', path: '/jwt', icon: '🎫', descKey: 'tool.jwt.desc' },
      { nameKey: 'tool.sql', path: '/sql', icon: '🗃️', descKey: 'tool.sql.desc' },
      { nameKey: 'tool.mybatis', path: '/mybatis', icon: '🐦', descKey: 'tool.mybatis.desc' },
      { nameKey: 'tool.csv', path: '/csv', icon: '📊', descKey: 'tool.csv.desc' },
      { nameKey: 'tool.html', path: '/html', icon: '🏷️', descKey: 'tool.html.desc' },
    ]
  },
  {
    categoryKey: 'category.generators',
    items: [
      { nameKey: 'tool.uuid', path: '/uuid', icon: '🆔', descKey: 'tool.uuid.desc' },
      { nameKey: 'tool.qrcode', path: '/qrcode', icon: '📱', descKey: 'tool.qrcode.desc' },
      { nameKey: 'tool.lorem', path: '/lorem', icon: '📄', descKey: 'tool.lorem.desc' },
    ]
  },
  {
    categoryKey: 'category.converters',
    items: [
      { nameKey: 'tool.timestamp', path: '/timestamp', icon: '⏰', descKey: 'tool.timestamp.desc' },
      { nameKey: 'tool.color', path: '/color', icon: '🎨', descKey: 'tool.color.desc' },
      { nameKey: 'tool.case', path: '/case', icon: '📝', descKey: 'tool.case.desc' },
    ]
  },
  {
    categoryKey: 'category.tools',
    items: [
      { nameKey: 'tool.regex', path: '/regex', icon: '🔍', descKey: 'tool.regex.desc' },
      { nameKey: 'tool.cron', path: '/cron', icon: '⏰', descKey: 'tool.cron.desc' },
      { nameKey: 'tool.diff', path: '/diff', icon: '📄', descKey: 'tool.diff.desc' },
    ]
  }
]

export default function Home() {
  const { t } = useLanguage()
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          {t('home.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          {t('home.subtitle')}
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
          {t('home.toolCount')}
        </p>
      </div>

      <div className="space-y-8">
        {toolsConfig.map((category) => (
          <div key={category.categoryKey}>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              {t(category.categoryKey)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((tool) => (
                <Link
                  key={tool.path}
                  href={tool.path}
                  className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-3xl">{tool.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                        {t(tool.nameKey)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t(tool.descKey)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 접을 수 있는 소개 섹션 - 맨 아래 */}
      <div className="mt-12">
        <button
          onClick={() => setIsAboutOpen(!isAboutOpen)}
          className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex items-center justify-between"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {t('home.aboutTitle')}
          </h2>
          <svg
            className={`w-6 h-6 text-gray-600 dark:text-gray-400 transition-transform ${
              isAboutOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isAboutOpen && (
          <div className="mt-4 space-y-6">
            {/* 소개 섹션 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed">
                  {t('home.aboutText1')}
                </p>
                <p className="leading-relaxed">
                  {t('home.aboutText2')}
                </p>
              </div>
            </div>

            {/* 주요 특징 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md p-8 border border-blue-200 dark:border-gray-600">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                {t('home.whyTitle')}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {num}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                        {t(`home.feature${num}.title`)}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {t(`home.feature${num}.desc`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
