import { describe, expect, it } from 'vitest'
import { buildCspHeader } from '@/utils/csp'

// CSP header generation should be stable and deterministic for security reviews.
describe('csp utils', () => {
  it('builds a CSP header from directives', () => {
    // Provide a small directive set to verify ordering and formatting.
    const header = buildCspHeader({
      'default-src': ["'self'"],
      'script-src': ["'self'", 'https://cdn.example.com'],
      'img-src': ['https:', 'data:'],
    })

    expect(header).toBe("default-src 'self'; script-src 'self' https://cdn.example.com; img-src https: data:")
  })
})
