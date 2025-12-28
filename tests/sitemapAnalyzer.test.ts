import { describe, expect, it } from 'vitest'
import { SitemapAnalyzerError, analyzeSitemapXml } from '@/utils/sitemapAnalyzer'

// Sitemap analyzer should parse urlset and sitemapindex formats.
describe('sitemapAnalyzer utils', () => {
  it('summarizes URL entries and duplicates', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://example.com/</loc>
          <lastmod>2024-01-01</lastmod>
        </url>
        <url>
          <loc>https://example.com/about</loc>
          <lastmod>2024-01-02</lastmod>
        </url>
        <url>
          <loc>https://example.com/about</loc>
        </url>
      </urlset>`

    const result = analyzeSitemapXml(xml)

    expect(result.type).toBe('urlset')
    expect(result.summary.total).toBe(3)
    expect(result.summary.duplicates).toBe(1)
    expect(result.summary.missingLastmod).toBe(1)
  })

  it('parses sitemapindex entries', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
          <loc>https://example.com/sitemap-1.xml</loc>
          <lastmod>2024-02-01</lastmod>
        </sitemap>
      </sitemapindex>`

    const result = analyzeSitemapXml(xml)

    expect(result.type).toBe('sitemapindex')
    expect(result.summary.total).toBe(1)
  })

  it('throws on invalid XML input', () => {
    expect(() => analyzeSitemapXml('<urlset><url>')).toThrow(SitemapAnalyzerError)
  })
})
