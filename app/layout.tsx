import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Analytics } from '@vercel/analytics/next'
import { getSiteBaseUrl } from '@/utils/siteUrl'

// Derive a single canonical base URL so every metadata field is consistent for SEO.
// This ensures Open Graph, JSON-LD, and canonical tags all point to the same domain.
const siteBaseUrl = getSiteBaseUrl()
const siteBase = new URL(siteBaseUrl)
// Keep the logo URL absolute so structured data can reference it reliably.
const logoUrl = new URL('/icon', siteBase).toString()
// Provide hreflang alternates so search engines can surface the English UI.
const languageAlternates = {
  'ko-KR': siteBaseUrl,
  'en-US': `${siteBaseUrl}/?lang=en`,
  'x-default': siteBaseUrl,
}

export const metadata: Metadata = {
  // metadataBase must be an absolute URL object so relative metadata resolves correctly.
  metadataBase: siteBase,
  // applicationName는 검색 엔진과 브라우저 UI에 표시되는 서비스 이름이다.
  applicationName: 'Developer Tools',
  // referrer 정책을 명시해 외부 링크 공유 시 필요한 정보만 전달한다.
  referrer: 'origin-when-cross-origin',
  // 자동 전화/주소 링크화를 막아 콘텐츠 의미가 왜곡되지 않도록 한다.
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  title: {
    default: 'Developer Tools - 개발자를 위한 필수 도구 모음',
    template: '%s | Developer Tools'
  },
  description: '개발자를 위한 80가지 이상의 필수 온라인 도구 모음. Base64, JSON, JWT, 정규식, DNS Lookup, WebSocket, CORS 테스터 등 개발에 필요한 유틸리티를 한 곳에서 무료로 사용하세요.',
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
    'CSP 헤더 빌더',
    'SRI 해시 생성기',
    'SSH 키 생성기',
    'OAuth Playground',
    'CORS 테스터',
    'DNS Lookup',
    'WebSocket 테스터',
    '응답 시간 측정',
    'JSONPath Finder',
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
    alternateLocale: ['en_US'],
    url: siteBaseUrl,
    title: 'Developer Tools - 개발자를 위한 필수 도구 모음',
    description: '개발자를 위한 80가지 이상의 필수 온라인 도구 모음. Base64, JSON, JWT, 정규식, DNS Lookup, WebSocket 등 개발에 필요한 유틸리티',
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
    description: '개발자를 위한 80가지 이상의 필수 온라인 도구 모음',
    images: ['/og-image'],
  },
  alternates: {
    canonical: siteBaseUrl,
    // Add hreflang alternates to support localized discovery in search.
    languages: languageAlternates,
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
        {/* Google Search Console 추가 검증용 메타 태그입니다. */}
        <meta
          name="google-site-verification"
          content="NexoY6FhlE-ob4BUgQqvntKcLZiJbgcUom6TUTgHEw8"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6853743390551388"
          crossOrigin="anonymous"
        />
        {/* Buy Me a Coffee 위젯은 Next Script로 비동기 로드해 렌더링 차단과 ESLint 에러를 피한다. */}
        <Script
          src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
          strategy="afterInteractive"
          data-name="bmc-button"
          data-slug="dlrbgns090p"
          data-color="#FFDD00"
          data-emoji=""
          data-font="Cookie"
          data-text="Buy me a coffee"
          data-outline-color="#000000"
          data-font-color="#000000"
          data-coffee-color="#ffffff"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // WebSite/Organization/WebApplication을 @graph로 묶어 검색 엔진에 관계를 명확히 알린다.
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  name: 'Developer Tools',
                  url: siteBaseUrl,
                  logo: logoUrl,
                },
                {
                  '@type': 'WebSite',
                  name: 'Developer Tools',
                  url: siteBaseUrl,
                  // Declare both Korean and English to signal multilingual support.
                  inLanguage: ['ko-KR', 'en-US'],
                  publisher: {
                    '@type': 'Organization',
                    name: 'Developer Tools',
                    url: siteBaseUrl,
                    logo: logoUrl,
                  },
                },
                {
                  '@type': 'WebApplication',
                  name: 'Developer Tools',
                  description: '개발자를 위한 80가지 이상의 필수 온라인 도구 모음',
                  // 구조화된 데이터도 canonical과 동일한 base URL을 사용해 검색 엔진 혼선을 줄인다.
                  url: siteBaseUrl,
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
                    '케이스 변환기',
                    'CSP 헤더 빌더',
                    'SRI 해시 생성기',
                    'SSH 키 생성기',
                    'OAuth Playground',
                    'CORS 테스터',
                    'DNS Lookup',
                    'WebSocket 테스터',
                    '응답 시간 측정',
                    'JSONPath Finder',
                    '스키마 시각화',
                    '레이아웃 플레이그라운드',
                    '브레이크포인트 테스터',
                  ],
                  // Provide language metadata for search engines and rich results.
                  inLanguage: ['ko-KR', 'en-US'],
                  publisher: {
                    '@type': 'Organization',
                    name: 'Developer Tools',
                    url: siteBaseUrl,
                    logo: logoUrl,
                  },
                },
              ],
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
