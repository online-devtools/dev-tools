import { MetadataRoute } from 'next'
import { normalizeBaseUrl } from '@/utils/normalizeBaseUrl'

export default function robots(): MetadataRoute.Robots {
  // 프로덕션 URL 설정 - 프로덕션 환경에서만 실제 도메인 사용
  const isProduction = process.env.VERCEL_ENV === 'production'
  const rawBaseUrl = isProduction
    ? 'https://dev-tools-online.vercel.app'
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-tools-online.vercel.app'
  // 환경값이 스킴 없이 들어와도 robots/sitemap에서 유효한 URL을 보장한다.
  const baseUrl = normalizeBaseUrl(rawBaseUrl)

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
