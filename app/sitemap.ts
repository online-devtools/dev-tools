import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dev-tools.example.com'

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
    // Generators
    '/uuid',
    '/qrcode',
    '/lorem',
    '/token-generator',
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
