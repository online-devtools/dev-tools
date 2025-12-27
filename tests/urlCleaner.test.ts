import { describe, expect, it } from 'vitest'
import { UrlCleanerError, cleanUrl } from '@/utils/urlCleaner'

// URL cleaner should remove tracking params and normalize query strings.
describe('urlCleaner utils', () => {
  it('removes tracking and empty params, sorts query', () => {
    const input =
      'https://example.com/page?utm_source=google&b=2&a=1&empty=&fbclid=123'

    const result = cleanUrl(input, {
      removeTracking: true,
      removeEmpty: true,
      sortQuery: true,
    })

    expect(result.cleanedUrl).toBe('https://example.com/page?a=1&b=2')
    expect(result.removedParams).toContain('utm_source')
    expect(result.removedParams).toContain('fbclid')
    expect(result.removedParams).toContain('empty')
  })

  it('keeps query order when sorting is disabled', () => {
    const input = 'https://example.com/page?b=2&a=1'
    const result = cleanUrl(input, {
      removeTracking: false,
      removeEmpty: false,
      sortQuery: false,
    })

    expect(result.cleanedUrl).toBe('https://example.com/page?b=2&a=1')
  })

  it('throws on invalid URLs', () => {
    expect(() =>
      cleanUrl('not-a-url', {
        removeTracking: true,
        removeEmpty: true,
        sortQuery: true,
      }),
    ).toThrow(UrlCleanerError)
  })
})
