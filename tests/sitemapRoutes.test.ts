import { describe, expect, it } from 'vitest'
import {
  getCategoryPaths,
  getToolPathsFromConfig,
  resolveRouteLastModified,
} from '@/utils/sitemapRoutes'

// Sitemap route tests guard against missing tool/category URLs in SEO output.
describe('sitemapRoutes', () => {
  it('returns unique tool paths from the tool config', () => {
    // The tool list should include well-known paths without duplicates.
    const toolPaths = getToolPathsFromConfig()

    // Base64 is a canonical tool route expected in the sitemap.
    expect(toolPaths).toContain('/base64')
    // Paths should be unique to avoid duplicate sitemap entries.
    expect(new Set(toolPaths).size).toBe(toolPaths.length)
  })

  it('exposes category hub paths for sitemap inclusion', () => {
    // Category hubs improve internal linking and should be indexed.
    const categoryPaths = getCategoryPaths()

    // Encoding is a core category and should have a hub URL.
    expect(categoryPaths).toContain('/category/encoding')
  })

  it('returns a file-based lastModified date when possible', () => {
    // Use a known route so the resolver can find a matching page file.
    const fallback = new Date(0)
    const lastModified = resolveRouteLastModified('/base64', fallback)

    // The result should be a Date newer than the fallback when the file exists.
    expect(lastModified.getTime()).toBeGreaterThan(fallback.getTime())
  })

  it('maps category routes to the shared category page file', () => {
    // Category hubs share a single dynamic page file under /category/[category].
    const fallback = new Date(0)
    const lastModified = resolveRouteLastModified('/category/encoding', fallback)

    // The shared category file should provide a real modification time.
    expect(lastModified.getTime()).toBeGreaterThan(fallback.getTime())
  })

  it('falls back when the route file does not exist', () => {
    // Unknown paths should return the provided fallback date.
    const fallback = new Date(0)
    const lastModified = resolveRouteLastModified('/nope', fallback)

    // Using strict equality here keeps the fallback behavior explicit.
    expect(lastModified.getTime()).toBe(fallback.getTime())
  })
})
