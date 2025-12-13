import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // 프로덕션 URL 설정 - 프로덕션 환경에서만 실제 도메인 사용
  const isProduction = process.env.VERCEL_ENV === 'production'
  const baseUrl = isProduction
    ? 'https://dev-tools-online.vercel.app'
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-tools-online.vercel.app'

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
