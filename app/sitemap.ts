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
    '/base64',
    '/url',
    '/jasypt',
    '/json',
    '/jwt',
    '/jwt-signer',
    '/sql',
    '/mybatis',
    '/csv',
    '/cron',
    '/hash',
    '/timestamp',
    '/uuid',
    '/regex',
    '/color',
    '/diff',
    '/qrcode',
    '/case',
    '/html',
    '/lorem',
    '/chmod',
    '/ipcalc',
    '/baseconv',
    '/password',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}
