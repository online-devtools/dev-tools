import { MetadataRoute } from 'next'
import { getSiteBaseUrl } from '@/utils/siteUrl'
import { SUPPORTED_LANGUAGES, buildLocalizedPathname } from '@/utils/i18n'

// 라우트 설정 타입 - 경로, 우선순위, 변경 빈도 포함
interface RouteConfig {
  path: string
  priority: number
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
}

// 빌드 시점의 날짜를 한 번만 계산하여 일관성 유지
// 모든 URL에 동일한 lastModified 값을 사용하여 크롤러 혼란 방지
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

  // 모든 도구 경로 목록 (인기 도구 포함)
  const allToolPaths = [
    // Encoding
    '/base64', '/url', '/html-entities', '/base64-file', '/image-base64', '/data-url',
    // Security
    '/jasypt', '/jwt-keys', '/hash', '/password', '/jwt-signer', '/bcrypt', '/hmac',
    '/otp', '/basic-auth', '/string-obfuscator', '/crypto-bundle', '/regex-safety',
    '/csp', '/sri', '/env-crypto', '/ssh-keys', '/saml', '/oauth',
    // Data Format
    '/json', '/jsonl', '/json-flatten', '/graphql', '/jwt', '/sql', '/mybatis',
    '/csv', '/html', '/yaml-json', '/yaml-toml', '/json-toml', '/xml-json',
    '/markdown-html', '/json-minify', '/json-csv', '/json-diff', '/json-path',
    '/json-schema', '/schema-to-ts', '/openapi', '/schema-mock', '/env-manager',
    '/env-diff', '/code-minifier', '/sql-builder', '/schema-visualizer',
    // Generators
    '/uuid', '/qrcode', '/lorem', '/token-generator', '/token-counter', '/ulid',
    '/port-generator', '/emoji-picker', '/meta-tags', '/css-gradient', '/box-shadow',
    '/mock-data', '/exif',
    // Converters
    '/timestamp', '/color', '/case', '/baseconv', '/roman-numeral', '/temp-converter',
    '/svg-optimizer', '/curl-converter',
    // Text
    '/slugify', '/nato-alphabet', '/text-binary', '/text-unicode', '/text-stats',
    '/log-redactor', '/numeronym', '/list-converter', '/email-normalizer',
    '/markdown-table', '/sorter',
    // Calculators
    '/math-eval', '/percentage-calc', '/semver',
    // Info
    '/http-status', '/mime-types', '/keycode', '/device-info', '/user-agent', '/a11y-check',
    // Linux
    '/chmod', '/regex', '/cron', '/cron-human', '/gitignore-generator',
    // Network
    '/ipcalc', '/diff', '/url-parser', '/ipv4-converter', '/http-headers',
    '/security-headers', '/url-cleaner', '/cookie-parser', '/http-builder',
    '/websocket', '/ssl-cert', '/dns-lookup', '/dns-compare', '/sitemap-analyzer',
    '/cert-chain', '/robots-tester', '/cors', '/latency', '/api-response-time',
    '/tls-diagnostics', '/grpc-client', '/webhook-tester', '/network-path',
    // Workflow
    '/commit-message', '/dependency-checker', '/regex-debugger', '/patch-viewer',
    '/patch-linter', '/api-scenario', '/contract-tester', '/otel-trace',
    '/k8s-validator', '/dockerfile-linter', '/github-actions-linter', '/terraform-diff',
    '/changelog-generator', '/terraform-linter', '/stack-trace', '/git-conflict',
    // Files
    '/file-hash', '/pdf-metadata', '/favicon',
    // Frontend
    '/color-palette', '/layout-playground', '/easing', '/breakpoint-tester',
    '/lighthouse-report', '/visual-diff', '/sql-explain', '/timezone',
    '/pagination-tester', '/webauthn',
    // Additional tools
    '/phone-parser', '/iban-validator', '/ascii-art', '/mac-address',
    '/password-strength', '/bip39',
  ]

  // 도구별 설정 생성 - 인기 도구는 높은 우선순위 부여
  const toolPages: RouteConfig[] = [...new Set(allToolPaths)].map(path => ({
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
    ...toolPages,
  ]

  // 언어별 프리픽스가 포함된 URL 생성 - 다국어 인덱싱 보장
  const localizedRoutes = SUPPORTED_LANGUAGES.flatMap((language) =>
    allRoutes.map((route) => {
      const normalizedPath = route.path === '' ? '/' : route.path
      const localizedPath = buildLocalizedPathname(normalizedPath, language)
      return {
        url: `${baseUrl}${localizedPath}`,
        // 모든 페이지에 동일한 빌드 날짜 사용 - 일관성 유지
        lastModified: BUILD_DATE,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      }
    }),
  )

  return localizedRoutes
}
