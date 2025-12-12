import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // 프로덕션 URL만 사용 (preview URL 제외)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                  process.env.NEXT_PUBLIC_VERCEL_URL ||
                  'http://localhost:3000'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
