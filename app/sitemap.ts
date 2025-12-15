import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Vercel이 production으로 배포된 경우에만 실서비스 도메인을 사용하고,
  // 그 외 환경에서는 NEXT_PUBLIC_SITE_URL(없으면 기본값)로 생성한다.
  // sitemap에 적힌 URL은 절대경로만 허용되므로 이 값을 먼저 확정한다.
  const isProduction = process.env.VERCEL_ENV === 'production'
  const baseUrl = isProduction
    ? 'https://dev-tools-online.vercel.app'
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-tools-online.vercel.app'

  // 정적 라우트들을 일괄 정의한다.
  // Next.js App Router의 각 도구 페이지 폴더를 명시적으로 나열해 검색 엔진이 모든 툴을 인덱싱할 수 있도록 한다.
  const routes = [
    '',
    '/about',
    '/faq',
    '/privacy',
    '/terms',
    '/contact',
    '/snippets',
    '/changelog',
    // Encoding
    '/base64',
    '/url',
    '/html-entities',
    '/base64-file',
    '/image-base64',
    '/data-url',
    // Security
    '/jasypt',
    '/jwt-keys',
    '/hash',
    '/password',
    '/jwt-signer',
    '/bcrypt',
    '/hmac',
    '/otp',
    '/basic-auth',
    '/string-obfuscator',
    '/crypto-bundle',
    '/regex-safety',
    // Data Format
    '/json',
    '/jwt',
    '/sql',
    '/mybatis',
    '/csv',
    '/html',
    '/yaml-json',
    '/yaml-toml',
    '/json-toml',
    '/xml-json',
    '/markdown-html',
    '/json-minify',
    '/json-csv',
    '/json-diff',
    '/json-schema',
    '/openapi',
    '/schema-mock',
    '/env-manager',
    '/code-minifier',
    '/sql-builder',
    // Generators
    '/uuid',
    '/qrcode',
    '/lorem',
    '/token-generator',
    '/token-counter',
    '/ulid',
    '/port-generator',
    '/emoji-picker',
    '/meta-tags',
    '/css-gradient',
    '/box-shadow',
    '/mock-data',
    // Converters
    '/timestamp',
    '/color',
    '/case',
    '/baseconv',
    '/roman-numeral',
    '/temp-converter',
    '/svg-optimizer',
    '/curl-converter',
    // Text
    '/slugify',
    '/nato-alphabet',
    '/text-binary',
    '/text-unicode',
    '/text-stats',
    '/numeronym',
    '/list-converter',
    '/email-normalizer',
    '/markdown-table',
    '/sorter',
    // Calculators
    '/math-eval',
    '/percentage-calc',
    // Info
    '/http-status',
    '/mime-types',
    '/keycode',
    '/device-info',
    '/user-agent',
    '/a11y-check',
    // Linux
    '/chmod',
    '/regex',
    '/cron',
    '/cron-human',
    '/gitignore-generator',
    // Network
    '/ipcalc',
    '/diff',
    '/url-parser',
    '/ipv4-converter',
    '/http-builder',
    // Additional tools
    '/phone-parser',
    '/iban-validator',
    '/ascii-art',
    '/mac-address',
    '/password-strength',
    '/bip39',
  ]

  // 각 경로를 Next.js가 요구하는 Sitemap 형태로 변환한다.
  // lastModified는 호출 시점의 시간으로 지정하여 최신 업데이트 신호를 검색엔진에 전달한다.
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}
