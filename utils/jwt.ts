import CryptoJS from 'crypto-js'

// Next.js runs both server and client code in JS, so CryptoJS offers HMAC helpers usable in either.

export type JwtAlgorithm = 'HS256' | 'HS384' | 'HS512'

const algorithmMap: Record<JwtAlgorithm, (message: string, secret: string) => CryptoJS.lib.WordArray> = {
  HS256: CryptoJS.HmacSHA256,
  HS384: CryptoJS.HmacSHA384,
  HS512: CryptoJS.HmacSHA512,
}

const base64Url = (value: string) =>
  value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const encodeWordArray = (wordArray: CryptoJS.lib.WordArray) =>
  base64Url(CryptoJS.enc.Base64.stringify(wordArray))

const encodeString = (value: string) => encodeWordArray(CryptoJS.enc.Utf8.parse(value))

type JwtHeader = Record<string, unknown> & { typ?: string }

export interface CreateJwtOptions {
  header: JwtHeader
  payload: Record<string, unknown>
  secret: string
  algorithm: JwtAlgorithm
}

export interface JwtSignResult {
  token: string
  signingInput: string
  signature: string
  headerSegment: string
  payloadSegment: string
}

export function createSignedJwt({ header, payload, secret, algorithm }: CreateJwtOptions): JwtSignResult {
  if (!secret.trim()) {
    throw new Error('jwtSigner.error.secretRequired')
  }

  const normalizedHeader: Record<string, unknown> = {
    alg: algorithm,
    typ: typeof header.typ === 'string' ? header.typ : 'JWT',
  }

  Object.entries(header).forEach(([key, value]) => {
    if (key === 'alg' || key === 'typ') {
      return
    }
    normalizedHeader[key] = value
  })

  const headerSegment = encodeString(JSON.stringify(normalizedHeader))
  const payloadSegment = encodeString(JSON.stringify(payload))
  const signingInput = `${headerSegment}.${payloadSegment}`
  const hashFn = algorithmMap[algorithm]

  if (!hashFn) {
    throw new Error('jwt.unsupportedAlgorithm')
  }

  const signature = encodeWordArray(hashFn(signingInput, secret))

  return {
    token: `${signingInput}.${signature}`,
    signingInput,
    signature,
    headerSegment,
    payloadSegment,
  }
}
