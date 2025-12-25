// Cookie header parsing/building helpers shared between UI and tests.
// The logic focuses on predictable parsing and explicit error codes.

export type CookieParserErrorCode = 'empty' | 'invalidPair' | 'invalidJson' | 'notObject'

export class CookieParserError extends Error {
  code: CookieParserErrorCode
  segment?: string

  constructor(code: CookieParserErrorCode, message: string, segment?: string) {
    super(message)
    this.name = 'CookieParserError'
    this.code = code
    this.segment = segment
  }
}

const ensureNotEmpty = (input: string) => {
  // Empty input is treated as a dedicated error so UI can display guidance.
  if (!input.trim()) {
    throw new CookieParserError('empty', 'Input is empty')
  }
}

const safeDecode = (value: string): string => {
  // Decode percent-encoded values without failing on malformed sequences.
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export const parseCookieHeader = (input: string): Record<string, string> => {
  ensureNotEmpty(input)

  const result: Record<string, string> = {}
  const segments = input.split(';')

  segments.forEach((segment) => {
    const trimmed = segment.trim()

    // Ignore empty segments created by duplicate semicolons.
    if (!trimmed) {
      return
    }

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex <= 0) {
      // Missing "=" or empty key is treated as an invalid cookie pair.
      throw new CookieParserError('invalidPair', 'Missing "=" separator', trimmed)
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim()

    if (!key) {
      throw new CookieParserError('invalidPair', 'Cookie name is empty', trimmed)
    }

    result[key] = safeDecode(value)
  })

  return result
}

export const buildCookieHeader = (cookies: Record<string, string>): string => {
  // Assemble a standard Cookie header by joining key=value pairs with "; ".
  const pairs = Object.entries(cookies).map(([key, value]) => {
    const normalizedValue = value === null || value === undefined ? '' : String(value)
    return `${key}=${encodeURIComponent(normalizedValue)}`
  })

  return pairs.join('; ')
}

export const toCookieJsonString = (input: string): string => {
  // Convert a Cookie header into a pretty JSON string for readability.
  const parsed = parseCookieHeader(input)
  return JSON.stringify(parsed, null, 2)
}

export const toCookieHeaderFromJson = (input: string): string => {
  ensureNotEmpty(input)

  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON'
    throw new CookieParserError('invalidJson', message)
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new CookieParserError('notObject', 'Expected a JSON object')
  }

  const cookies: Record<string, string> = {}

  Object.entries(parsed).forEach(([key, value]) => {
    // Normalize non-string values to strings for header serialization.
    if (value === null || value === undefined) {
      cookies[key] = ''
    } else {
      cookies[key] = String(value)
    }
  })

  return buildCookieHeader(cookies)
}
