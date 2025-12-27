import { MetadataRoute } from 'next'
import { getSiteBaseUrl } from '@/utils/siteUrl'

export default function robots(): MetadataRoute.Robots {
  // robots.txt는 절대 URL을 요구하므로 공통 유틸에서 정규화된 base URL을 가져온다.
  // 이렇게 하면 metadata/robots/sitemap이 동일한 도메인을 가리켜 SEO 혼선을 줄인다.
  const baseUrl = getSiteBaseUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    // 명시적으로 Host를 지정해 검색 엔진이 대표 도메인을 인식하도록 돕는다.
    host: baseUrl,
  }
}
