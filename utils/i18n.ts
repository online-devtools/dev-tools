export const SUPPORTED_LANGUAGES = ['ko', 'en', 'ja', 'pt', 'de'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// Keep a single default language so middleware, layout, and client stay in sync.
export const DEFAULT_LANGUAGE: SupportedLanguage = 'ko'

// Shared cookie/header keys ensure consistent language detection across layers.
export const LANGUAGE_COOKIE = 'dt-lang'
export const LANGUAGE_HEADER = 'x-lang'
export const PATHNAME_HEADER = 'x-pathname'

export const isSupportedLanguage = (value: string | null | undefined): value is SupportedLanguage => {
  // Use the literal list to avoid accepting unexpected locale tags.
  return value === 'ko' || value === 'en' || value === 'ja' || value === 'pt' || value === 'de'
}

export const getLanguageFromPathname = (pathname: string): SupportedLanguage | null => {
  // The first path segment indicates the language prefix when present.
  const segments = pathname.split('/').filter(Boolean)
  const candidate = segments[0] ?? ''
  return isSupportedLanguage(candidate) ? candidate : null
}

export const stripLanguageFromPathname = (
  pathname: string,
): { language: SupportedLanguage | null; pathname: string } => {
  // Normalize the incoming path so it always starts with a single slash.
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  const segments = normalized.split('/').filter(Boolean)
  const language = isSupportedLanguage(segments[0] ?? '') ? (segments[0] as SupportedLanguage) : null

  if (!language) {
    return { language: null, pathname: normalized === '' ? '/' : normalized }
  }

  // Remove the language segment while preserving the remainder of the path.
  const rest = segments.slice(1)
  const stripped = rest.length === 0 ? '/' : `/${rest.join('/')}`
  return { language, pathname: stripped }
}

export const buildLocalizedPathname = (pathname: string, language: SupportedLanguage): string => {
  // Ensure we do not double-prefix paths that already contain a language.
  const stripped = stripLanguageFromPathname(pathname).pathname
  if (stripped === '/' || stripped === '') {
    return `/${language}`
  }
  return `/${language}${stripped}`
}

export const pickPreferredLanguage = (
  acceptLanguage: string | null | undefined,
  fallback: SupportedLanguage = DEFAULT_LANGUAGE,
): SupportedLanguage => {
  // If no Accept-Language header is present, fall back to the default.
  if (!acceptLanguage || !acceptLanguage.trim()) {
    return fallback
  }

  // Split the header into language tags with optional q-values.
  const parsed = acceptLanguage
    .split(',')
    .map((entry) => {
      const [tagPart, qualityPart] = entry.trim().split(';q=')
      const quality = Number.parseFloat(qualityPart ?? '1')
      return {
        tag: tagPart.toLowerCase(),
        quality: Number.isFinite(quality) ? quality : 0,
      }
    })
    .sort((a, b) => b.quality - a.quality)

  // Select the first supported language that matches the preference list.
  for (const candidate of parsed) {
    if (candidate.tag.startsWith('ko')) return 'ko'
    if (candidate.tag.startsWith('en')) return 'en'
    if (candidate.tag.startsWith('ja')) return 'ja'
    if (candidate.tag.startsWith('pt')) return 'pt'
    if (candidate.tag.startsWith('de')) return 'de'
  }

  return fallback
}
