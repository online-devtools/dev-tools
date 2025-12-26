// OAuth 2.0 helpers for PKCE and authorization URL building.
// These utilities are pure and can be used in tests and UI code.

export const base64UrlEncode = (buffer: ArrayBuffer): string => {
  // Convert bytes to base64url (RFC 7636) without padding.
  const base64 = typeof btoa === 'function'
    ? btoa(String.fromCharCode(...new Uint8Array(buffer)))
    : Buffer.from(buffer).toString('base64')

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const getSubtleCrypto = async (): Promise<SubtleCrypto> => {
  // Use Web Crypto if available; Node fallback uses webcrypto.
  if (globalThis.crypto?.subtle) {
    return globalThis.crypto.subtle
  }
  const nodeCrypto = await import('crypto')
  // Node's SubtleCrypto typings diverge from DOM typings; cast to share the API shape.
  return nodeCrypto.webcrypto.subtle as unknown as SubtleCrypto
}

export const generatePkceChallenge = async (verifier: string): Promise<string> => {
  // Hash the verifier with SHA-256 and base64url-encode the result.
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const subtle = await getSubtleCrypto()
  const digest = await subtle.digest('SHA-256', data)
  return base64UrlEncode(digest)
}

export const generateCodeVerifier = (length: number = 64): string => {
  // Create a random PKCE verifier using URL-safe characters.
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const bytes = new Uint8Array(length)
  globalThis.crypto.getRandomValues(bytes)

  let result = ''
  bytes.forEach((byte) => {
    result += charset[byte % charset.length]
  })

  return result
}

export const buildAuthorizeUrl = (params: Record<string, string>, baseUrl: string): string => {
  // Build the authorization URL with query parameters.
  const url = new URL(baseUrl)
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value)
    }
  })

  return url.toString()
}
