// SSH key parsing helpers for analyzing existing public keys in the browser.
// The goal is to extract metadata without relying on external binaries.

export type SshKeyErrorCode = 'empty' | 'invalidFormat' | 'invalidBase64'

export class SshKeyError extends Error {
  code: SshKeyErrorCode

  constructor(code: SshKeyErrorCode, message: string) {
    super(message)
    this.name = 'SshKeyError'
    this.code = code
  }
}

export type ParsedSshPublicKey = {
  type: string
  comment: string
  bits?: number
  fingerprintSha256?: string
}

const decodeBase64 = (input: string): Uint8Array => {
  // Normalize whitespace to keep pasted keys parseable.
  const cleaned = input.replace(/\s+/g, '')

  try {
    if (typeof atob === 'function') {
      const binary = atob(cleaned)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i)
      }
      return bytes
    }

    // Node.js fallback uses Buffer for base64 decoding.
    return Uint8Array.from(Buffer.from(cleaned, 'base64'))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid base64'
    throw new SshKeyError('invalidBase64', message)
  }
}

const readUint32 = (bytes: Uint8Array, offset: number): number => {
  // SSH wire format uses big-endian 32-bit lengths.
  return (
    (bytes[offset] << 24) |
    (bytes[offset + 1] << 16) |
    (bytes[offset + 2] << 8) |
    bytes[offset + 3]
  ) >>> 0
}

const readBytes = (bytes: Uint8Array, offset: number): { value: Uint8Array; nextOffset: number } => {
  // Each SSH field is a length-prefixed byte array.
  const length = readUint32(bytes, offset)
  const start = offset + 4
  const end = start + length
  return {
    value: bytes.slice(start, end),
    nextOffset: end,
  }
}

const readString = (bytes: Uint8Array, offset: number): { value: string; nextOffset: number } => {
  // Strings are length-prefixed UTF-8 byte arrays in the SSH key blob.
  const { value, nextOffset } = readBytes(bytes, offset)
  const text = new TextDecoder('utf-8').decode(value)
  return { value: text, nextOffset }
}

const computeFingerprintSha256 = async (bytes: Uint8Array): Promise<string> => {
  // Use Web Crypto to compute the SHA-256 fingerprint of the key blob.
  const subtle = globalThis.crypto?.subtle
  if (!subtle) {
    // Node fallback uses the built-in crypto module.
    const nodeCrypto = await import('crypto')
    const hash = nodeCrypto.createHash('sha256').update(Buffer.from(bytes)).digest('base64')
    return hash
  }

  const digest = await subtle.digest('SHA-256', bytes)
  const base64 = typeof btoa === 'function'
    ? btoa(String.fromCharCode(...new Uint8Array(digest)))
    : Buffer.from(digest).toString('base64')

  return base64
}

const calculateRsaBits = (modulus: Uint8Array): number => {
  // RSA key size is the bit length of the modulus (n).
  if (modulus.length === 0) return 0

  const firstByte = modulus[0]
  let leadingBits = 0
  for (let bit = 7; bit >= 0; bit -= 1) {
    if (firstByte & (1 << bit)) {
      leadingBits = bit + 1
      break
    }
  }

  return (modulus.length - 1) * 8 + leadingBits
}

export const parseSshPublicKey = (input: string): ParsedSshPublicKey => {
  const trimmed = input.trim()
  if (!trimmed) {
    throw new SshKeyError('empty', 'Input is empty')
  }

  const parts = trimmed.split(/\s+/)
  if (parts.length < 2) {
    throw new SshKeyError('invalidFormat', 'Expected "type base64 [comment]" format')
  }

  const [type, base64, ...commentParts] = parts
  const comment = commentParts.join(' ')

  const bytes = decodeBase64(base64)

  // Parse the SSH key blob header to derive additional metadata.
  let offset = 0
  const header = readString(bytes, offset)
  const blobType = header.value
  offset = header.nextOffset

  let bits: number | undefined
  if (blobType === 'ssh-rsa') {
    // SSH RSA keys store exponent then modulus as mpint values.
    const exponent = readBytes(bytes, offset)
    offset = exponent.nextOffset
    const modulus = readBytes(bytes, offset)
    bits = calculateRsaBits(modulus.value)
  } else if (blobType === 'ssh-ed25519') {
    // ED25519 keys are always 256 bits.
    bits = 256
  } else if (blobType.startsWith('ecdsa-sha2-')) {
    // ECDSA keys encode the curve name and the public point.
    const curve = readString(bytes, offset)
    if (curve.value.includes('nistp256')) bits = 256
    if (curve.value.includes('nistp384')) bits = 384
    if (curve.value.includes('nistp521')) bits = 521
  }

  return {
    type: type || blobType,
    comment,
    bits,
    // Fingerprints are computed on the full key blob, not the ASCII line.
    fingerprintSha256: undefined,
  }
}

export const parseSshPublicKeyWithFingerprint = async (input: string): Promise<ParsedSshPublicKey> => {
  // The async variant is used by the UI so we can compute fingerprints.
  const trimmed = input.trim()
  if (!trimmed) {
    throw new SshKeyError('empty', 'Input is empty')
  }

  const parts = trimmed.split(/\s+/)
  if (parts.length < 2) {
    throw new SshKeyError('invalidFormat', 'Expected "type base64 [comment]" format')
  }

  const [type, base64, ...commentParts] = parts
  const comment = commentParts.join(' ')

  const bytes = decodeBase64(base64)
  const baseInfo = parseSshPublicKey(input)
  const fingerprint = await computeFingerprintSha256(bytes)

  return {
    ...baseInfo,
    type,
    comment,
    fingerprintSha256: fingerprint,
  }
}
