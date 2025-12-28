export type CertChainEntry = {
  index: number
  pem: string
  derSize: number
  fingerprintSha256: string
  isDuplicate: boolean
}

export type CertChainSummary = {
  total: number
  duplicates: number
}

export type CertChainResult = {
  certificates: CertChainEntry[]
  summary: CertChainSummary
  warnings: string[]
}

export type CertChainErrorCode = 'noCertificates' | 'invalidCertificate' | 'cryptoUnavailable'

export class CertChainError extends Error {
  code: CertChainErrorCode

  constructor(code: CertChainErrorCode, message: string) {
    super(message)
    this.name = 'CertChainError'
    this.code = code
  }
}

const CERT_PEM_REGEX = /-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/g

const getSubtleCrypto = (): SubtleCrypto => {
  // WebCrypto is required for SHA-256 fingerprints.
  const subtle = globalThis.crypto?.subtle
  if (!subtle) {
    throw new CertChainError('cryptoUnavailable', 'WebCrypto is not available in this environment.')
  }
  return subtle
}

const decodeBase64ToBytes = (value: string): Uint8Array => {
  // Remove all whitespace so the base64 decoder can operate cleanly.
  const normalized = value.replace(/\s+/g, '')
  if (!normalized) {
    throw new CertChainError('invalidCertificate', 'Certificate payload is empty.')
  }
  if (!/^[A-Za-z0-9+/=]+$/.test(normalized)) {
    throw new CertChainError('invalidCertificate', 'Certificate payload contains invalid base64.')
  }

  // Use Buffer in Node, otherwise fall back to atob in the browser.
  if (typeof Buffer !== 'undefined') {
    return Uint8Array.from(Buffer.from(normalized, 'base64'))
  }

  if (typeof atob !== 'undefined') {
    const binary = atob(normalized)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes
  }

  throw new CertChainError('cryptoUnavailable', 'No base64 decoder is available.')
}

const toHex = (buffer: ArrayBuffer): string => {
  // Convert digest bytes into uppercase hex string for display.
  const bytes = new Uint8Array(buffer)
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

const hashSha256 = async (bytes: Uint8Array): Promise<string> => {
  const subtle = getSubtleCrypto()
  // WebCrypto typings require an ArrayBuffer-backed view, so copy into ArrayBuffer.
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)
  const digest = await subtle.digest('SHA-256', buffer)
  return toHex(digest)
}

export const inspectCertificateChain = async (input: string): Promise<CertChainResult> => {
  // Extract PEM blocks from the input string.
  const matches = Array.from(input.matchAll(CERT_PEM_REGEX))
  if (matches.length === 0) {
    throw new CertChainError('noCertificates', 'No certificate blocks were found.')
  }

  const warnings: string[] = []
  const certificates: CertChainEntry[] = []
  const seenFingerprints = new Set<string>()
  let duplicates = 0

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index]
    const payload = match[1] ?? ''
    const bytes = decodeBase64ToBytes(payload)
    const fingerprintSha256 = await hashSha256(bytes)
    const isDuplicate = seenFingerprints.has(fingerprintSha256)

    if (isDuplicate) {
      duplicates += 1
      warnings.push(`Duplicate certificate detected at index ${index + 1}.`)
    } else {
      seenFingerprints.add(fingerprintSha256)
    }

    certificates.push({
      index,
      pem: match[0],
      derSize: bytes.byteLength,
      fingerprintSha256,
      isDuplicate,
    })
  }

  return {
    certificates,
    summary: {
      total: certificates.length,
      duplicates,
    },
    warnings,
  }
}
