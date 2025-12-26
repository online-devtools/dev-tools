import { describe, expect, it } from 'vitest'
import { hashString } from '@/utils/fileHash'

// File hashing must produce deterministic digests for integrity checks.
describe('fileHash utils', () => {
  it('hashes a string with SHA-256 in hex format', async () => {
    // The SHA-256 hash of "hello" is a known reference value.
    const digest = await hashString('hello', 'SHA-256', 'hex')

    expect(digest).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
  })
})
