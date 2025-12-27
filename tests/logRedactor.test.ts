import { describe, expect, it } from 'vitest'
import { LogRedactorError, redactText } from '@/utils/logRedactor'

// Log redactor should mask common sensitive tokens without a backend.
describe('logRedactor utils', () => {
  it('redacts emails and IPv4 addresses', () => {
    // Include an email and IP address to verify masking behavior.
    const input = 'User test@example.com logged in from 192.168.0.10'
    const result = redactText(input, {
      maskEmail: true,
      maskIpv4: true,
      maskIpv6: false,
      maskJwt: false,
    })

    expect(result.output).toContain('[REDACTED_EMAIL]')
    expect(result.output).toContain('[REDACTED_IP]')
    expect(result.counts.email).toBe(1)
    expect(result.counts.ipv4).toBe(1)
  })

  it('redacts JWT tokens', () => {
    // Use a JWT-like token to verify pattern matching.
    const input =
      'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZm9vIn0.signature'
    const result = redactText(input, {
      maskEmail: false,
      maskIpv4: false,
      maskIpv6: false,
      maskJwt: true,
    })

    expect(result.output).toContain('[REDACTED_JWT]')
    expect(result.counts.jwt).toBe(1)
  })

  it('throws for invalid custom regex', () => {
    // Invalid regex patterns should return a structured error.
    expect(() =>
      redactText('sample', {
        maskEmail: false,
        maskIpv4: false,
        maskIpv6: false,
        maskJwt: false,
        customPattern: '(',
      }),
    ).toThrow(LogRedactorError)
  })
})
