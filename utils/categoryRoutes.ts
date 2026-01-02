import { stripLanguageFromPathname } from '@/utils/i18n'

// Category URLs use a shared prefix so breadcrumbs and hubs stay consistent.
export const CATEGORY_PATH_PREFIX = '/category'

// Map category translation keys to stable URL slugs.
export const CATEGORY_SLUGS: Record<string, string> = {
  'category.encoding': 'encoding',
  'category.security': 'security',
  'category.dataFormat': 'data-format',
  'category.generators': 'generators',
  'category.converters': 'converters',
  'category.text': 'text',
  'category.calculators': 'calculators',
  'category.info': 'info',
  'category.linux': 'linux',
  'category.network': 'network',
  'category.workflow': 'workflow',
  'category.files': 'files',
  'category.frontend': 'frontend',
}

// Reverse lookup table to resolve a slug back to its category key.
const CATEGORY_KEY_BY_SLUG: Record<string, string> = Object.entries(CATEGORY_SLUGS).reduce(
  (acc, [key, value]) => {
    acc[value] = key
    return acc
  },
  {} as Record<string, string>,
)

// Build the category hub path from a translation key.
export const getCategoryPath = (categoryKey: string): string | null => {
  const slug = CATEGORY_SLUGS[categoryKey]
  if (!slug) {
    return null
  }

  return `${CATEGORY_PATH_PREFIX}/${slug}`
}

// Resolve a localized pathname back to a category key and slug.
export const resolveCategoryFromPathname = (
  pathname: string,
): { categoryKey: string; slug: string } | null => {
  // Normalize the path by stripping any language prefix and trailing slash.
  const normalized = stripLanguageFromPathname(pathname).pathname.replace(/\/$/, '')

  if (!normalized.startsWith(`${CATEGORY_PATH_PREFIX}/`)) {
    return null
  }

  const slug = normalized.split('/')[2] ?? ''
  if (!slug) {
    return null
  }

  // Reverse-map the slug to its category key for breadcrumb usage.
  const categoryKey = CATEGORY_KEY_BY_SLUG[slug]
  if (!categoryKey) {
    return null
  }

  return { categoryKey, slug }
}

// Resolve a category key from a slug without parsing a full pathname.
export const getCategoryKeyBySlug = (slug: string): string | null => {
  return CATEGORY_KEY_BY_SLUG[slug] ?? null
}
