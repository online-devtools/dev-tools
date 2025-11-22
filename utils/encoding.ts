// Next.js renders on both server (Node) and client, so feature-detect each runtime.
const hasBrowserBtoa = typeof globalThis !== 'undefined' && typeof (globalThis as any).btoa === 'function'
const hasBrowserAtob = typeof globalThis !== 'undefined' && typeof (globalThis as any).atob === 'function'
const hasNodeBuffer = typeof globalThis !== 'undefined' && typeof (globalThis as any).Buffer !== 'undefined'

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

function encodeBytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  if (hasBrowserBtoa) {
    return (globalThis as any).btoa(binary)
  }

  if (hasNodeBuffer) {
    return (globalThis as any).Buffer.from(binary, 'binary').toString('base64')
  }

  throw new Error('Base64 encoding is not supported in this environment')
}

function decodeBase64ToBytes(value: string): Uint8Array {
  if (hasBrowserAtob) {
    const binary = (globalThis as any).atob(value)
    return Uint8Array.from(binary, (char: string) => char.charCodeAt(0))
  }

  if (hasNodeBuffer) {
    const buffer = (globalThis as any).Buffer.from(value, 'base64')
    return new Uint8Array(buffer)
  }

  throw new Error('Base64 decoding is not supported in this environment')
}

export function encodeBase64(value: string): string {
  if (value === undefined || value === null) {
    throw new Error('encodeBase64 requires a string input')
  }

  // TextEncoder/TextDecoder keep emoji and multibyte chars intact.
  const bytes = textEncoder.encode(value)
  return encodeBytesToBase64(bytes)
}

export function decodeBase64(value: string): string {
  if (value === undefined || value === null) {
    throw new Error('decodeBase64 requires a string input')
  }

  const bytes = decodeBase64ToBytes(value)
  return textDecoder.decode(bytes)
}
