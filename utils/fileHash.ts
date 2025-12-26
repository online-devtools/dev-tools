// File hashing helpers for checksum validation and integrity checks.
// The implementation supports both browser Web Crypto and Node fallback.

export type HashAlgorithm = 'SHA-256' | 'SHA-1' | 'SHA-384' | 'SHA-512'
export type HashOutput = 'hex' | 'base64'

const bufferToHex = (buffer: ArrayBuffer): string => {
  // Convert an ArrayBuffer into a lowercase hex string.
  const bytes = new Uint8Array(buffer)
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

const bufferToBase64 = (buffer: ArrayBuffer): string => {
  // Convert an ArrayBuffer into base64 for SRI or compact sharing.
  if (typeof btoa === 'function') {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
  }
  return Buffer.from(buffer).toString('base64')
}

const getSubtleCrypto = async (): Promise<SubtleCrypto> => {
  // Prefer browser Web Crypto, but fall back to Node's webcrypto if needed.
  if (globalThis.crypto?.subtle) {
    return globalThis.crypto.subtle
  }

  const nodeCrypto = await import('crypto')
  return nodeCrypto.webcrypto.subtle
}

export const hashArrayBuffer = async (
  buffer: ArrayBuffer,
  algorithm: HashAlgorithm,
  output: HashOutput = 'hex'
): Promise<string> => {
  // Web Crypto uses the same algorithm labels (SHA-256, SHA-1, etc.).
  const subtle = await getSubtleCrypto()
  const digest = await subtle.digest(algorithm, buffer)

  return output === 'hex' ? bufferToHex(digest) : bufferToBase64(digest)
}

export const hashString = async (
  input: string,
  algorithm: HashAlgorithm,
  output: HashOutput = 'hex'
): Promise<string> => {
  // Use TextEncoder to convert UTF-8 text into bytes before hashing.
  const encoder = new TextEncoder()
  const buffer = encoder.encode(input).buffer
  return hashArrayBuffer(buffer, algorithm, output)
}
