import { describe, expect, it } from 'vitest'
import { computeSri } from '@/utils/sri'

// SRI hashes must match known digests for CDN integrity checks.
describe('sri utils', () => {
  it('computes a SHA-256 SRI string for text input', async () => {
    // "hello" has a known SHA-256 digest for verification.
    const sri = await computeSri('hello', 'sha256')

    expect(sri).toBe('sha256-LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ=')
  })
})
