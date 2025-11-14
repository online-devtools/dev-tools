import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dev-tools.example.com'

  const routes = [
    '',
    '/about',
    '/privacy',
    '/terms',
    '/contact',
    '/base64',
    '/url',
    '/jasypt',
    '/json',
    '/jwt',
    '/sql',
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
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}
