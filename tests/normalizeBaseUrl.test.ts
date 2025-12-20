import { describe, expect, it } from 'vitest'
import { normalizeBaseUrl } from '@/utils/normalizeBaseUrl'

// Base URL normalization keeps sitemap/robots compliant with absolute URL rules.
describe('normalizeBaseUrl', () => {
  it('adds https when scheme is missing', () => {
    // Missing scheme is the main cause of "invalid URL" errors in sitemap submissions.
    expect(normalizeBaseUrl('dev-tools.example.com')).toBe('https://dev-tools.example.com')
  })

  it('preserves an existing https scheme', () => {
    // When the caller already supplies https, normalization should not alter it.
    expect(normalizeBaseUrl('https://dev-tools.example.com')).toBe('https://dev-tools.example.com')
  })

  it('preserves an existing http scheme', () => {
    // Some environments still use http internally; we should keep that explicitly.
    expect(normalizeBaseUrl('http://dev-tools.example.com')).toBe('http://dev-tools.example.com')
  })

  it('trims whitespace and trailing slashes', () => {
    // Trailing slashes can create double slashes when paths are concatenated.
    expect(normalizeBaseUrl('  https://dev-tools.example.com/  ')).toBe(
      'https://dev-tools.example.com',
    )
  })
})
