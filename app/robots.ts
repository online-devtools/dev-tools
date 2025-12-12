import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // 프로덕션 URL 설정 - 환경 변수 우선, 없으면 기본값 사용
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                  'https://dev-tools-online.vercel.app'

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
