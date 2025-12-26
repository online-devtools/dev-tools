import { describe, expect, it } from 'vitest'
import { SshKeyError, parseSshPublicKey, parseSshPublicKeyWithFingerprint } from '@/utils/sshKeys'

// SSH key parsing is security-sensitive, so we validate format handling and metadata extraction.
describe('sshKeys utils', () => {
  it('parses an RSA public key line and extracts metadata', async () => {
    // Use a real ssh-keygen output line so parsing reflects real-world usage.
    const input = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAAgQC/n4p+lHLzCG7pveK4GVLoBcR1DiMMb5FfOQCLVrY81SjnddHks+J5coG7FP/oUAtBHVgS74E52ac4qRt4iKa2rLNS6HMWhh5g9DoLI7vnPddwAHpapoiS0MnhCmYZ1PPHnKfNz45Xv6/ENjsvtZ/nXbjCNZv2YhZwf8tnna/0XQ== user@example.com'

    // The parser should identify the key type and preserve the comment.
    const parsed = await parseSshPublicKeyWithFingerprint(input)
    expect(parsed.type).toBe('ssh-rsa')
    expect(parsed.comment).toBe('user@example.com')
    expect(parsed.fingerprintSha256).toBeTruthy()
  })

  it('parses an ED25519 public key line', () => {
    // ED25519 keys are common in modern SSH setups.
    const input = 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPoY+WXcj8F6KX0tJcMUsK11CXsSRcyIHe2dfp9BU0C9 user@example.com'

    // The parser should return the correct key type without errors.
    const parsed = parseSshPublicKey(input)
    expect(parsed.type).toBe('ssh-ed25519')
    expect(parsed.comment).toBe('user@example.com')
  })

  it('throws a structured error for empty input', () => {
    try {
      // Empty input should produce an explicit error for UI messaging.
      parseSshPublicKey('   ')
      throw new Error('Expected parseSshPublicKey to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(SshKeyError)
      const typed = error as SshKeyError
      expect(typed.code).toBe('empty')
    }
  })

  it('throws a structured error for invalid formats', () => {
    try {
      // Missing type and base64 payload should be rejected.
      parseSshPublicKey('not-a-key')
      throw new Error('Expected parseSshPublicKey to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(SshKeyError)
      const typed = error as SshKeyError
      expect(typed.code).toBe('invalidFormat')
    }
  })
})
