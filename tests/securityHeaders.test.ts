import { describe, expect, it } from 'vitest'
import { analyzeSecurityHeaders, SecurityHeadersError } from '@/utils/securityHeaders'

// Security header analyzer should highlight missing or weak headers.
describe('securityHeaders utils', () => {
  it('marks required headers as ok when present', () => {
    // Provide a complete header set to verify ok statuses.
    const input = [
      "Content-Security-Policy: default-src 'self'",
      'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload',
      'X-Content-Type-Options: nosniff',
      'X-Frame-Options: DENY',
      'Referrer-Policy: no-referrer',
      'Permissions-Policy: geolocation=()',
      'Cross-Origin-Opener-Policy: same-origin',
      'Cross-Origin-Embedder-Policy: require-corp',
      'Cross-Origin-Resource-Policy: same-origin',
    ].join('\n')

    const result = analyzeSecurityHeaders(input)
    const summary = result.summary

    expect(summary.missing).toBe(0)
    expect(summary.warn).toBe(0)
    expect(summary.ok).toBeGreaterThan(0)
  })

  it('flags weak HSTS and unsafe CSP directives', () => {
    // Use a low max-age and unsafe-inline to trigger warnings.
    const input = [
      "Content-Security-Policy: default-src 'self' 'unsafe-inline'",
      'Strict-Transport-Security: max-age=300',
      'X-Content-Type-Options: nosniff',
      'X-Frame-Options: SAMEORIGIN',
      'Referrer-Policy: no-referrer',
    ].join('\n')

    const result = analyzeSecurityHeaders(input)
    const hstsItem = result.items.find((item) => item.id === 'hsts')
    const cspItem = result.items.find((item) => item.id === 'csp')

    expect(hstsItem?.status).toBe('warn')
    expect(cspItem?.status).toBe('warn')
  })

  it('throws on empty input', () => {
    // Empty inputs should raise a structured error.
    expect(() => analyzeSecurityHeaders('')).toThrow(SecurityHeadersError)
  })
})
