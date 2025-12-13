import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // 프로덕션 URL 설정 - 프로덕션 환경에서만 실제 도메인 사용
  const isProduction = process.env.VERCEL_ENV === 'production'
  const baseUrl = isProduction
    ? 'https://dev-tools-online.vercel.app'
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-tools-online.vercel.app'

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
    // Security
    '/jasypt',
    '/hash',
    '/password',
    '/jwt-signer',
    '/bcrypt',
    '/hmac',
    '/otp',
    '/basic-auth',
    '/string-obfuscator',
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
    // Generators
    '/uuid',
    '/qrcode',
    '/lorem',
    '/token-generator',
    '/token-counter',
    '/ulid',
    '/port-generator',
    '/emoji-picker',
    // Converters
    '/timestamp',
    '/color',
    '/case',
    '/baseconv',
    '/roman-numeral',
    '/temp-converter',
    '/svg-optimizer',
    // Text
    '/slugify',
    '/nato-alphabet',
    '/text-binary',
    '/text-unicode',
    '/text-stats',
    '/numeronym',
    '/list-converter',
    '/email-normalizer',
    // Calculators
    '/math-eval',
    '/percentage-calc',
    // Info
    '/http-status',
    '/mime-types',
    '/keycode',
    '/device-info',
    '/user-agent',
    // Linux
    '/chmod',
    '/regex',
    '/cron',
    '/gitignore-generator',
    // Network
    '/ipcalc',
    '/diff',
    '/url-parser',
    '/ipv4-converter',
    // Additional tools
    '/phone-parser',
    '/iban-validator',
    '/ascii-art',
    '/mac-address',
    '/password-strength',
    '/bip39',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}
