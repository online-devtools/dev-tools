import { MetadataRoute } from 'next'
import { getSiteBaseUrl } from '@/utils/siteUrl'
import { SUPPORTED_LANGUAGES, buildLocalizedPathname } from '@/utils/i18n'
import {
  getCategoryPaths,
  getToolPathsFromConfig,
  resolveRouteLastModified,
} from '@/utils/sitemapRoutes'

// Use the Node.js runtime so filesystem-based timestamps are available.
export const runtime = 'nodejs'

// 라우트 설정 타입 - 경로, 우선순위, 변경 빈도 포함
interface RouteConfig {
  path: string
  priority: number
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
}

// Build timestamp is used as a fallback when a page file is missing.
// This keeps sitemap generation deterministic while still allowing file-based dates.
const BUILD_DATE = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  // sitemap에는 절대 URL만 허용되므로 공통 유틸에서 base URL을 확정한다.
  const baseUrl = getSiteBaseUrl()

  // 핵심 페이지 - 가장 높은 우선순위 (1.0)
  const corePages: RouteConfig[] = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
  ]

  // 주요 정보 페이지 - 높은 우선순위 (0.9)
  const infoPages: RouteConfig[] = [
    { path: '/about', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/snippets', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/changelog', priority: 0.9, changeFrequency: 'weekly' },
  ]

  // 법적 페이지 - 낮은 우선순위 (0.3)
  const legalPages: RouteConfig[] = [
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
  ]

  // 인기 도구 - 높은 우선순위 (0.9) - 사용량이 많은 핵심 도구들
  const popularToolPaths = [
    '/base64', '/json', '/jwt', '/regex', '/url', '/uuid', '/qrcode',
    '/timestamp', '/hash', '/password', '/color', '/diff', '/cron',
  ]

  // All tool paths are derived from config so the sitemap stays in sync.
  const toolPaths = getToolPathsFromConfig()

  // Category hubs should be indexed so internal linking flows through them.
  const categoryPages: RouteConfig[] = getCategoryPaths().map((path) => ({
    path,
    priority: 0.7,
    changeFrequency: 'weekly',
  }))

  // 도구별 설정 생성 - 인기 도구는 높은 우선순위 부여
  const toolPages: RouteConfig[] = toolPaths.map((path) => ({
    path,
    // 인기 도구는 0.9, 일반 도구는 0.8 우선순위
    priority: popularToolPaths.includes(path) ? 0.9 : 0.8,
    changeFrequency: 'weekly' as const,
  }))

  // 모든 라우트 설정 병합
  const allRoutes: RouteConfig[] = [
    ...corePages,
    ...infoPages,
    ...legalPages,
    ...categoryPages,
    ...toolPages,
  ]

  // 언어별 프리픽스가 포함된 URL 생성 - 다국어 인덱싱 보장
  const localizedRoutes = SUPPORTED_LANGUAGES.flatMap((language) =>
    allRoutes.map((route) => {
      const normalizedPath = route.path === '' ? '/' : route.path
      const localizedPath = buildLocalizedPathname(normalizedPath, language)
      // Use the page file mtime when available so crawlers see fresher updates.
      const lastModified = resolveRouteLastModified(normalizedPath, BUILD_DATE)
      return {
        url: `${baseUrl}${localizedPath}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      }
    }),
  )

  return localizedRoutes
}
