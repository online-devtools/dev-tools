// Subresource Integrity (SRI) helpers to hash content for CDN validation.
// SRI values are "sha256-<base64>" or similar.

import { hashString } from './fileHash'

export type SriAlgorithm = 'sha256' | 'sha384' | 'sha512'

const toWebCryptoAlgorithm = (algorithm: SriAlgorithm) => {
  // Web Crypto expects uppercase with hyphen (e.g., SHA-256).
  if (algorithm === 'sha256') return 'SHA-256'
  if (algorithm === 'sha384') return 'SHA-384'
  return 'SHA-512'
}

export const computeSri = async (input: string, algorithm: SriAlgorithm): Promise<string> => {
  // Compute the digest in base64 and prefix with the algorithm label.
  const digest = await hashString(input, toWebCryptoAlgorithm(algorithm), 'base64')
  return `${algorithm}-${digest}`
}
