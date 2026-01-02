import { describe, expect, it } from 'vitest'
import {
  getCategoryKeyBySlug,
  getCategoryPath,
  resolveCategoryFromPathname,
} from '@/utils/categoryRoutes'

// Category routing tests ensure breadcrumb links and category hubs stay consistent.
describe('categoryRoutes', () => {
  it('builds a stable category path from a category key', () => {
    // Encoding is a core category and should map to a predictable URL.
    const path = getCategoryPath('category.encoding')

    // The generated path should be the canonical hub route.
    expect(path).toBe('/category/encoding')
  })

  it('resolves a category from a localized pathname', () => {
    // Localized URLs should resolve back to the category key used in config.
    const result = resolveCategoryFromPathname('/en/category/encoding/')

    // The resolver should return the category key for downstream SEO usage.
    expect(result?.categoryKey).toBe('category.encoding')
  })

  it('returns null for unknown category slugs', () => {
    // Unknown slugs should not map to any category.
    const result = resolveCategoryFromPathname('/category/does-not-exist')

    // Explicit null prevents invalid breadcrumb URLs.
    expect(result).toBeNull()
  })

  it('maps a slug back to the category key', () => {
    // The slug is used in URLs but we need the i18n key for labeling.
    const key = getCategoryKeyBySlug('encoding')

    // The lookup should return the exact category translation key.
    expect(key).toBe('category.encoding')
  })
})
