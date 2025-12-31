import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Analytics } from '@vercel/analytics/next'
import { getSiteBaseUrl } from '@/utils/siteUrl'
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_HEADER,
  PATHNAME_HEADER,
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  buildLocalizedPathname,
  isSupportedLanguage,
  stripLanguageFromPathname,
} from '@/utils/i18n'

// Derive a single canonical base URL so every metadata field is consistent for SEO.
// This ensures Open Graph, JSON-LD, and canonical tags all point to the same domain.
const siteBaseUrl = getSiteBaseUrl()
const siteBase = new URL(siteBaseUrl)
// Keep the logo URL absolute so structured data can reference it reliably.
const logoUrl = new URL('/icon', siteBase).toString()
const localeByLanguage: Record<SupportedLanguage, string> = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
  pt: 'pt-BR',
  de: 'de-DE',
}

const openGraphLocaleByLanguage: Record<SupportedLanguage, string> = {
  ko: 'ko_KR',
  en: 'en_US',
  ja: 'ja_JP',
  pt: 'pt_BR',
  de: 'de_DE',
}

const titleByLanguage: Record<SupportedLanguage, { default: string; template: string }> = {
  ko: {
    default: 'Developer Tools - 개발자를 위한 필수 도구 모음',
    template: '%s | Developer Tools',
  },
  en: {
    default: 'Developer Tools - Essential Online Tools for Developers',
    template: '%s | Developer Tools',
  },
  ja: {
    default: 'Developer Tools - 開発者向け必須ツール',
    template: '%s | Developer Tools',
  },
  pt: {
    default: 'Developer Tools - Ferramentas essenciais para desenvolvedores',
    template: '%s | Developer Tools',
  },
  de: {
    default: 'Developer Tools - Unverzichtbare Tools für Entwickler',
    template: '%s | Developer Tools',
  },
}

const descriptionByLanguage: Record<SupportedLanguage, string> = {
  ko: '개발자를 위한 80가지 이상의 필수 온라인 도구 모음. Base64, JSON, JWT, 정규식, DNS Lookup, WebSocket, CORS 테스터 등 개발에 필요한 유틸리티를 한 곳에서 무료로 사용하세요.',
  en: '80+ essential online tools for developers. Use Base64, JSON, JWT, Regex, DNS Lookup, WebSocket, and more utilities for free in one place.',
  ja: '開発者向けの80以上の無料オンラインツール。Base64、JSON、JWT、正規表現、DNS Lookup、WebSocketなどを一か所で。',
  pt: 'Mais de 80 ferramentas online gratuitas para desenvolvedores. Base64, JSON, JWT, Regex, DNS Lookup, WebSocket e mais em um só lugar.',
  de: 'Über 80 kostenlose Online-Tools für Entwickler. Base64, JSON, JWT, Regex, DNS Lookup, WebSocket und mehr an einem Ort.',
}

const buildLanguageAlternates = (pathname: string): Record<string, string> => {
  // Construct hreflang URLs for each supported language.
  const alternates: Record<string, string> = {}
  SUPPORTED_LANGUAGES.forEach((language) => {
    const hrefLang = localeByLanguage[language]
    const localizedPath = buildLocalizedPathname(pathname, language)
    alternates[hrefLang] = new URL(localizedPath, siteBase).toString()
  })

  // x-default signals the primary locale for unspecified audiences.
  alternates['x-default'] = new URL(
    buildLocalizedPathname(pathname, DEFAULT_LANGUAGE),
    siteBase,
  ).toString()

  return alternates
}

const resolveRequestLanguage = (headerValue: string | null): SupportedLanguage => {
  // Prefer the language set by middleware; otherwise fallback to default.
  if (isSupportedLanguage(headerValue)) {
    return headerValue
  }
  return DEFAULT_LANGUAGE
}

const resolveRequestPathname = (headerValue: string | null): string => {
  // Fall back to root when the middleware header is missing.
  if (!headerValue) {
    return '/'
  }
  return headerValue.startsWith('/') ? headerValue : `/${headerValue}`
}

const baseMetadata: Omit<
  Metadata,
  'title' | 'description' | 'openGraph' | 'twitter' | 'alternates'
> = {
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
    'web developer tools',
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
  verification: {
    google: 'Jq8ncQ8slNfWXuqPL_ZZv8f10qrXEApKFkjkwDsy56k',
    // yandex: 'yandex-verification-code',
    // bing: 'bing-verification-code',
  },
  category: 'technology',
}

export const generateMetadata = async (): Promise<Metadata> => {
  // Read language + pathname from middleware to emit correct hreflang/canonical tags.
  const requestHeaders = await headers()
  const requestLanguage = resolveRequestLanguage(requestHeaders.get(LANGUAGE_HEADER))
  const requestPathname = resolveRequestPathname(requestHeaders.get(PATHNAME_HEADER))
  const strippedPathname = stripLanguageFromPathname(requestPathname).pathname

  const canonicalPath = buildLocalizedPathname(strippedPathname, requestLanguage)
  const canonicalUrl = new URL(canonicalPath, siteBase).toString()
  const languageAlternates = buildLanguageAlternates(strippedPathname)

  const localizedTitle = titleByLanguage[requestLanguage]
  const localizedDescription = descriptionByLanguage[requestLanguage]
  const openGraphLocale = openGraphLocaleByLanguage[requestLanguage]
  const alternateLocale = SUPPORTED_LANGUAGES
    .filter((language) => language !== requestLanguage)
    .map((language) => openGraphLocaleByLanguage[language])

  return {
    ...baseMetadata,
    title: localizedTitle,
    description: localizedDescription,
    openGraph: {
      type: 'website',
      locale: openGraphLocale,
      alternateLocale,
      url: canonicalUrl,
      title: localizedTitle.default,
      description: localizedDescription,
      siteName: 'Developer Tools',
      images: [
        {
          // 언어 파라미터를 포함한 OG 이미지 URL로 다국어 이미지 제공
          url: `/og-image?lang=${requestLanguage}`,
          width: 1200,
          height: 630,
          alt: localizedTitle.default,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedTitle.default,
      description: localizedDescription,
      // 트위터 카드도 언어별 이미지 사용
      images: [`/og-image?lang=${requestLanguage}`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
  }
}

const featureListByLanguage: Record<SupportedLanguage, string[]> = {
  ko: [
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
  en: [
    'Base64 encoder/decoder',
    'URL encoder/decoder',
    'JSON formatter',
    'JWT decoder',
    'Regex tester',
    'QR code generator',
    'UUID generator',
    'Hash generator',
    'Timestamp converter',
    'Color converter',
    'Jasypt encryption',
    'HTML/XML formatter',
    'Lorem Ipsum generator',
    'Diff checker',
    'Case converter',
    'CSP header builder',
    'SRI hash generator',
    'SSH key generator',
    'OAuth Playground',
    'CORS tester',
    'DNS Lookup',
    'WebSocket tester',
    'Response time checker',
    'JSONPath Finder',
    'Schema visualizer',
    'Layout playground',
    'Breakpoint tester',
  ],
  ja: [
    'Base64 エンコーダー/デコーダー',
    'URL エンコーダー/デコーダー',
    'JSON フォーマッター',
    'JWT デコーダー',
    '正規表現テスター',
    'QRコード生成',
    'UUID 生成',
    'ハッシュ生成',
    'タイムスタンプ変換',
    'カラー変換',
    'Jasypt 暗号化',
    'HTML/XML フォーマッター',
    'Lorem Ipsum 生成',
    'Diff チェッカー',
    'ケース変換',
    'CSP ヘッダービルダー',
    'SRI ハッシュ生成',
    'SSH キー生成',
    'OAuth Playground',
    'CORS テスター',
    'DNS Lookup',
    'WebSocket テスター',
    '応答時間計測',
    'JSONPath Finder',
    'スキーマ可視化',
    'レイアウトプレイグラウンド',
    'ブレークポイントテスター',
  ],
  pt: [
    'Codificador/decodificador Base64',
    'Codificador/decodificador de URL',
    'Formatador de JSON',
    'Decodificador JWT',
    'Testador de regex',
    'Gerador de QR Code',
    'Gerador de UUID',
    'Gerador de hash',
    'Conversor de timestamp',
    'Conversor de cores',
    'Criptografia Jasypt',
    'Formatador HTML/XML',
    'Gerador de Lorem Ipsum',
    'Verificador de diff',
    'Conversor de caixa',
    'Construtor de cabeçalho CSP',
    'Gerador de hash SRI',
    'Gerador de chave SSH',
    'OAuth Playground',
    'Testador de CORS',
    'DNS Lookup',
    'Testador de WebSocket',
    'Medição de tempo de resposta',
    'JSONPath Finder',
    'Visualizador de esquema',
    'Layout playground',
    'Testador de breakpoint',
  ],
  de: [
    'Base64-Encoder/Decoder',
    'URL-Encoder/Decoder',
    'JSON-Formatter',
    'JWT-Decoder',
    'Regex-Tester',
    'QR-Code-Generator',
    'UUID-Generator',
    'Hash-Generator',
    'Timestamp-Konverter',
    'Farbkonverter',
    'Jasypt-Verschlüsselung',
    'HTML/XML-Formatter',
    'Lorem-Ipsum-Generator',
    'Diff-Checker',
    'Case-Konverter',
    'CSP-Header-Builder',
    'SRI-Hash-Generator',
    'SSH-Key-Generator',
    'OAuth Playground',
    'CORS-Tester',
    'DNS Lookup',
    'WebSocket-Tester',
    'Antwortzeit-Messung',
    'JSONPath Finder',
    'Schema-Visualisierung',
    'Layout Playground',
    'Breakpoint-Tester',
  ],
}

const footerCopyByLanguage: Record<
  SupportedLanguage,
  {
    summary: string
    quickLinksTitle: string
    legalTitle: string
    about: string
    faq: string
    contact: string
    terms: string
    privacy: string
    privacyNote: string
  }
> = {
  ko: {
    summary:
      '개발자를 위한 80가지 이상의 무료 온라인 도구를 제공합니다. Base64, JSON, JWT, 정규식 등 필수 개발 도구를 한 곳에서.',
    quickLinksTitle: '바로가기',
    legalTitle: '법적 고지',
    about: '소개',
    faq: '자주 묻는 질문',
    contact: '문의하기',
    terms: '이용약관',
    privacy: '개인정보 처리방침',
    privacyNote:
      '대부분의 도구는 브라우저에서 동작하며, 네트워크가 필요한 도구만 실행 시에 데이터가 전송됩니다.',
  },
  en: {
    summary:
      'Explore 80+ free online tools for developers. Base64, JSON, JWT, Regex, and more essentials in one place.',
    quickLinksTitle: 'Quick Links',
    legalTitle: 'Legal',
    about: 'About',
    faq: 'FAQ',
    contact: 'Contact',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    privacyNote:
      'Most tools run in the browser; tools that require network access only send data when you run them.',
  },
  ja: {
    summary:
      '開発者向けの80以上の無料オンラインツールを提供します。Base64、JSON、JWT、正規表現など必須ツールを一か所で。',
    quickLinksTitle: 'クイックリンク',
    legalTitle: '法的情報',
    about: '紹介',
    faq: 'FAQ',
    contact: 'お問い合わせ',
    terms: '利用規約',
    privacy: 'プライバシーポリシー',
    privacyNote: 'ほとんどのツールはブラウザ内で動作し、ネットワークが必要なツールのみ実行時にデータを送信します。',
  },
  pt: {
    summary:
      'Mais de 80 ferramentas online gratuitas para desenvolvedores. Base64, JSON, JWT, Regex e muito mais em um só lugar.',
    quickLinksTitle: 'Links rápidos',
    legalTitle: 'Legal',
    about: 'Sobre',
    faq: 'FAQ',
    contact: 'Contato',
    terms: 'Termos de Serviço',
    privacy: 'Política de Privacidade',
    privacyNote: 'A maioria das ferramentas roda no navegador; apenas as que precisam de rede enviam dados quando você executa.',
  },
  de: {
    summary:
      'Über 80 kostenlose Online-Tools für Entwickler. Base64, JSON, JWT, Regex und mehr an einem Ort.',
    quickLinksTitle: 'Schnellzugriff',
    legalTitle: 'Rechtliches',
    about: 'Über uns',
    faq: 'FAQ',
    contact: 'Kontakt',
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutz',
    privacyNote: 'Die meisten Tools laufen im Browser; nur Tools mit Netzwerkanforderungen senden Daten beim Ausführen.',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Read the request language so the root HTML attributes and providers match the URL.
  const requestHeaders = await headers()
  const requestLanguage = resolveRequestLanguage(requestHeaders.get(LANGUAGE_HEADER))
  const htmlLang = localeByLanguage[requestLanguage]
  const structuredDescription = descriptionByLanguage[requestLanguage]
  const featureList = featureListByLanguage[requestLanguage]
  const footerCopy = footerCopyByLanguage[requestLanguage]
  // Build localized footer URLs so navigation stays on the same locale.
  const footerLinks = {
    about: buildLocalizedPathname('/about', requestLanguage),
    faq: buildLocalizedPathname('/faq', requestLanguage),
    contact: buildLocalizedPathname('/contact', requestLanguage),
    terms: buildLocalizedPathname('/terms', requestLanguage),
    privacy: buildLocalizedPathname('/privacy', requestLanguage),
  }

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager - head script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P7SJHKJP');`,
          }}
        />
        {/* Google tag (gtag.js) - GA4 직접 연동 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-F77CE5RFZM"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-F77CE5RFZM');
`,
          }}
        />
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
                  description: structuredDescription,
                  // 구조화된 데이터도 canonical과 동일한 base URL을 사용해 검색 엔진 혼선을 줄인다.
                  url: siteBaseUrl,
                  applicationCategory: 'DeveloperApplication',
                  operatingSystem: 'Any',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'KRW',
                  },
                  featureList,
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
        {/* Google Tag Manager (noscript) - body 시작 직후 */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P7SJHKJP"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <ThemeProvider>
          <LanguageProvider initialLanguage={requestLanguage}>
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
                      {footerCopy.summary}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                      {footerCopy.quickLinksTitle}
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href={footerLinks.about} className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
                          {footerCopy.about}
                        </a>
                      </li>
                      <li>
                        <a href={footerLinks.faq} className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
                          {footerCopy.faq}
                        </a>
                      </li>
                      <li>
                        <a href={footerLinks.contact} className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
                          {footerCopy.contact}
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
                      {footerCopy.legalTitle}
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href={footerLinks.terms} className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
                          {footerCopy.terms}
                        </a>
                      </li>
                      <li>
                        <a href={footerLinks.privacy} className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
                          {footerCopy.privacy}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
                  <p>Developer Tools © 2025. All rights reserved.</p>
                  <p className="mt-2 text-xs">
                    {footerCopy.privacyNote}
                  </p>
                </div>
              </div>
            </footer>
          </LayoutWrapper>
        </LanguageProvider>
        </ThemeProvider>
        {/* Vercel Analytics - 성능 모니터링 */}
        <Analytics />
      </body>
    </html>
  )
}
