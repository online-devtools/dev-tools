import { normalizeBaseUrl } from '@/utils/normalizeBaseUrl'

// Centralize the canonical site URL selection so metadata, robots, and sitemap stay consistent.
// This prevents SEO regressions where different files emit different base URLs.
const DEFAULT_SITE_URL = 'https://dev-tools-online.com'

export const resolveSiteBaseUrl = (env: NodeJS.ProcessEnv): string => {
  // Prefer an explicitly configured public URL to keep canonical tags stable in production.
  const explicitBaseUrl = env.NEXT_PUBLIC_SITE_URL

  // Vercel provides a deployment hostname without a scheme; we promote it to https:// when used.
  const vercelBaseUrl = env.VERCEL_URL ? `https://${env.VERCEL_URL}` : ''

  // Choose the first non-empty candidate and normalize it into a valid absolute URL.
  const rawBaseUrl = explicitBaseUrl || vercelBaseUrl || DEFAULT_SITE_URL

  // normalizeBaseUrl trims whitespace, ensures a scheme, and removes trailing slashes for safe joins.
  return normalizeBaseUrl(rawBaseUrl)
}

export const getSiteBaseUrl = (): string => {
  // Wrap process.env so production code is simple while tests can inject custom env objects.
  return resolveSiteBaseUrl(process.env)
}
