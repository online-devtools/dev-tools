import type { Metadata } from 'next'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  metadataBase: new URL('https://dev-tools.example.com'), // 실제 배포 URL로 변경 필요
  title: {
    default: 'Developer Tools - 개발자를 위한 필수 도구 모음',
    template: '%s | Developer Tools'
  },
  description: '개발자를 위한 15가지 필수 온라인 도구 모음. Base64, URL 인코딩, JSON 포맷터, JWT 디코더, 정규식 테스터, QR 코드 생성기 등 개발에 필요한 모든 유틸리티를 한 곳에서 무료로 사용하세요.',
  keywords: [
    '개발자 도구',
    'developer tools',
    'Base64 인코더',
    'URL 인코더',
    'JSON 포맷터',
    'JWT 디코더',
    '정규식 테스터',
    'regex tester',
    'QR 코드 생성기',
    'UUID 생성기',
    '해시 생성기',
    '타임스탬프 변환기',
    '컬러 변환기',
    'Jasypt 암호화',
    'HTML 포맷터',
    'Lorem Ipsum 생성기',
    '온라인 개발 도구',
    '무료 개발 도구',
    'web developer tools'
  ],
  authors: [{ name: 'Developer Tools Team' }],
  creator: 'Developer Tools',
  publisher: 'Developer Tools',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://dev-tools.example.com',
    title: 'Developer Tools - 개발자를 위한 필수 도구 모음',
    description: '개발자를 위한 15가지 필수 온라인 도구 모음. Base64, JSON, JWT, 정규식, QR 코드 등 개발에 필요한 모든 유틸리티',
    siteName: 'Developer Tools',
    images: [
      {
        url: '/og-image',
        width: 1200,
        height: 630,
        alt: 'Developer Tools - 개발자 도구 모음',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Tools - 개발자를 위한 필수 도구 모음',
    description: '개발자를 위한 15가지 필수 온라인 도구 모음',
    images: ['/og-image'],
  },
  alternates: {
    canonical: 'https://dev-tools.example.com',
  },
  verification: {
    google: 'Jq8ncQ8slNfWXuqPL_ZZv8f10qrXEApKFkjkwDsy56k',
    // yandex: 'yandex-verification-code',
    // bing: 'bing-verification-code',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="Jq8ncQ8slNfWXuqPL_ZZv8f10qrXEApKFkjkwDsy56k"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6853743390551388"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Developer Tools',
              description: '개발자를 위한 15가지 필수 온라인 도구 모음',
              url: 'https://dev-tools.example.com',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'KRW',
              },
              featureList: [
                'Base64 인코더/디코더',
                'URL 인코더/디코더',
                'JSON 포맷터',
                'JWT 디코더',
                '정규식 테스터',
                'QR 코드 생성기',
                'UUID 생성기',
                '해시 생성기',
                '타임스탬프 변환기',
                '컬러 변환기',
                'Jasypt 암호화',
                'HTML/XML 포맷터',
                'Lorem Ipsum 생성기',
                'Diff Checker',
                '케이스 변환기'
              ],
              inLanguage: 'ko-KR',
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  // ThemeProvider에서 사용하는 저장 키와 동일하게 맞춰 초기 렌더 시 깜박임을 줄입니다.
                  const saved = localStorage.getItem('dev-tools-theme')
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

                  let useDark = false
                  if (!saved || saved === 'auto') {
                    useDark = prefersDark
                  } else {
                    useDark = saved === 'dark'
                  }

                  document.documentElement.classList[useDark ? 'add' : 'remove']('dark')
                } catch (e) {
                  // If access fails, fallback to system preference via CSS
                }
              })();
            `
          }}
        />
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ThemeProvider>
          <LanguageProvider>
            <LayoutWrapper>
              <div className="container mx-auto px-4 py-8">
                {children}
              </div>
            <footer className="mt-auto py-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Developer Tools</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      개발자를 위한 18가지 이상의 무료 온라인 도구를 제공합니다.
                      Base64, JSON, JWT, 정규식 등 필수 개발 도구를 한 곳에서.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">바로가기</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">소개</a>
                      </li>
                      <li>
                        <a href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">자주 묻는 질문</a>
                      </li>
                      <li>
                        <a href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">문의하기</a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">법적 고지</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">이용약관</a>
                      </li>
                      <li>
                        <a href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">개인정보 처리방침</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
                  <p>Developer Tools © 2025. All rights reserved.</p>
                  <p className="mt-2 text-xs">
                    모든 도구는 클라이언트 사이드에서만 작동하며, 입력 데이터는 서버로 전송되지 않습니다.
                  </p>
                </div>
              </div>
            </footer>
          </LayoutWrapper>
        </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
