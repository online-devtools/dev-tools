'use client'

import JasyptTool from '@/components/JasyptTool'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function JasyptPage() {
  const { t } = useLanguage()
  const [isSeoOpen, setIsSeoOpen] = useState(false)

  // 동적으로 페이지 제목 설정
  useEffect(() => {
    document.title = t('jasypt.title') + ' | Developer Tools'
  }, [t])

  return (
    <div className="max-w-4xl mx-auto">
      <JasyptTool />

      {/* 접을 수 있는 SEO 콘텐츠 섹션 */}
      <div className="mt-8">
        <button
          onClick={() => setIsSeoOpen(!isSeoOpen)}
          className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex items-center justify-between"
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('jasypt.seo.moreInfo')}
          </h2>
          <svg
            className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
              isSeoOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isSeoOpen && (
          <div className="mt-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('jasypt.seo.intro')}
              </p>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6 mb-3">
                {t('jasypt.seo.features')}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>{t('jasypt.seo.feature1')}</li>
                <li>{t('jasypt.seo.feature2')}</li>
                <li>{t('jasypt.seo.feature3')}</li>
                <li>{t('jasypt.seo.feature4')}</li>
                <li>{t('jasypt.seo.feature5')}</li>
                <li>{t('jasypt.seo.feature6')}</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6 mb-3">
                {t('jasypt.seo.howToUse')}
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>{t('jasypt.seo.step1')}</li>
                <li>{t('jasypt.seo.step2')}</li>
                <li>{t('jasypt.seo.step3')}</li>
                <li>{t('jasypt.seo.step4')}</li>
                <li>{t('jasypt.seo.step5')}</li>
              </ol>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6 mb-3">
                {t('jasypt.seo.whyUse')}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {t('jasypt.seo.whyUseDesc')}
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>{t('jasypt.seo.useCase1')}</li>
                <li>{t('jasypt.seo.useCase2')}</li>
                <li>{t('jasypt.seo.useCase3')}</li>
                <li>{t('jasypt.seo.useCase4')}</li>
                <li>{t('jasypt.seo.useCase5')}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
