import { NextRequest, NextResponse } from 'next/server'
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE,
  LANGUAGE_HEADER,
  PATHNAME_HEADER,
  buildLocalizedPathname,
  getLanguageFromPathname,
  isSupportedLanguage,
  pickPreferredLanguage,
  stripLanguageFromPathname,
} from '@/utils/i18n'

// Cache the cookie for a long time so repeat visits stay in the same language.
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

const IGNORED_PREFIXES = [
  '/_next',
  '/api',
  '/favicon',
  '/icon',
  '/og-image',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest',
]

const PUBLIC_FILE_REGEX = /\.[^/]+$/

const shouldIgnorePath = (pathname: string): boolean => {
  // Skip middleware for Next.js internals, API routes, and static assets.
  if (PUBLIC_FILE_REGEX.test(pathname)) return true
  return IGNORED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (shouldIgnorePath(pathname)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  const languageFromPath = getLanguageFromPathname(pathname)
  const requestHeaders = new Headers(request.headers)

  // Persist language via cookies and fallback to Accept-Language when missing.
  const cookieLang = request.cookies.get(LANGUAGE_COOKIE)?.value
  const preferredLang = isSupportedLanguage(cookieLang)
    ? cookieLang
    : pickPreferredLanguage(request.headers.get('accept-language'), DEFAULT_LANGUAGE)

  if (languageFromPath) {
    // Pass the language and original path to server components through headers.
    requestHeaders.set(LANGUAGE_HEADER, languageFromPath)
    requestHeaders.set(PATHNAME_HEADER, pathname)

    // Strip the locale prefix so the existing routes remain valid.
    const strippedPath = stripLanguageFromPathname(pathname).pathname
    url.pathname = strippedPath

    const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } })
    response.cookies.set(LANGUAGE_COOKIE, languageFromPath, {
      path: '/',
      maxAge: ONE_YEAR_SECONDS,
    })
    return response
  }

  // Redirect bare paths to the preferred locale prefix for SEO-friendly URLs.
  const targetLanguage = preferredLang ?? DEFAULT_LANGUAGE
  requestHeaders.set(LANGUAGE_HEADER, targetLanguage)
  requestHeaders.set(PATHNAME_HEADER, pathname)

  url.pathname = buildLocalizedPathname(pathname, targetLanguage)
  const response = NextResponse.redirect(url)
  response.cookies.set(LANGUAGE_COOKIE, targetLanguage, {
    path: '/',
    maxAge: ONE_YEAR_SECONDS,
  })
  return response
}

export const config = {
  // Apply middleware broadly but skip Next.js internals and common static assets.
  matcher: ['/((?!_next/|api/|favicon.ico|robots.txt|sitemap.xml|manifest).*)'],
}
