import { describe, expect, it } from 'vitest'
import { EnvCryptoError, decryptEnv, encryptEnv } from '@/utils/envCrypto'

// .env encryption tests ensure round-trip safety for sensitive config values.
describe('envCrypto utils', () => {
  it('encrypts and decrypts .env content with deterministic parameters', () => {
    // Use fixed salt/iv so the encrypted output is deterministic for tests.
    const input = '# Comment\nAPI_KEY=abc123\nEMPTY=\n'
    const encrypted = encryptEnv(input, 'secret', {
      salt: '00000000000000000000000000000000',
      iv: '00000000000000000000000000000000',
    })

    // Encrypted output should contain the ENC marker for each value.
    expect(encrypted).toContain('API_KEY=ENC::')

    // Decryption should restore the original .env content including comments.
    const decrypted = decryptEnv(encrypted, 'secret')
    expect(decrypted).toBe(input)
  })

  it('throws a structured error on empty input', () => {
    try {
      // Blank input should be rejected early for user feedback.
      encryptEnv('   ', 'secret')
      throw new Error('Expected encryptEnv to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(EnvCryptoError)
      const typed = error as EnvCryptoError
      expect(typed.code).toBe('empty')
    }
  })
})
