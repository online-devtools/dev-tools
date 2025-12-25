// HTTP header parsing utilities are centralized here for reuse across UI and tests.
// The functions return structured errors so UI components can translate them cleanly.

export type HeaderValue = string | string[]
export type HeadersObject = Record<string, HeaderValue>

export type HttpHeadersErrorCode = 'empty' | 'invalidLine' | 'invalidJson' | 'notObject' | 'invalidValue'

export class HttpHeadersError extends Error {
  code: HttpHeadersErrorCode
  line?: number

  constructor(code: HttpHeadersErrorCode, message: string, line?: number) {
    super(message)
    this.name = 'HttpHeadersError'
    this.code = code
    this.line = line
  }
}

const ensureNotEmpty = (input: string) => {
  // Avoid ambiguous conversions when the input is blank.
  if (!input.trim()) {
    throw new HttpHeadersError('empty', 'Input is empty')
  }
}

export const parseHeadersBlock = (input: string): HeadersObject => {
  ensureNotEmpty(input)

  const lines = input.split('\n')
  const headers: HeadersObject = {}

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim()
    // Skip empty lines to keep formatting flexible.
    if (!line) return

    const colonIndex = line.indexOf(':')
    if (colonIndex <= 0) {
      // Missing or leading colon makes the header invalid.
      throw new HttpHeadersError('invalidLine', 'Missing ":" separator', index + 1)
    }

    const key = line.slice(0, colonIndex).trim()
    const value = line.slice(colonIndex + 1).trim()

    if (!key) {
      throw new HttpHeadersError('invalidLine', 'Header name is empty', index + 1)
    }

    const existing = headers[key]
    if (existing === undefined) {
      headers[key] = value
      return
    }

    // Preserve duplicates (e.g., Set-Cookie) by storing them in an array.
    if (Array.isArray(existing)) {
      headers[key] = [...existing, value]
    } else {
      headers[key] = [existing, value]
    }
  })

  return headers
}

export const toHeadersBlock = (headers: HeadersObject): string => {
  // Convert a structured object back into a header block string.
  const lines: string[] = []

  Object.entries(headers).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        lines.push(`${key}: ${item}`)
      })
    } else {
      lines.push(`${key}: ${value}`)
    }
  })

  return lines.join('\n')
}

export const toHeadersJsonString = (input: string): string => {
  const headers = parseHeadersBlock(input)
  return JSON.stringify(headers, null, 2)
}

export const toHeadersBlockFromJson = (input: string): string => {
  ensureNotEmpty(input)

  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON'
    throw new HttpHeadersError('invalidJson', message)
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new HttpHeadersError('notObject', 'Expected a JSON object')
  }

  const normalized: HeadersObject = {}

  Object.entries(parsed).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const invalidIndex = value.findIndex((item) => typeof item !== 'string')
      if (invalidIndex >= 0) {
        throw new HttpHeadersError('invalidValue', 'Array header values must be strings')
      }
      normalized[key] = value as string[]
      return
    }

    if (typeof value !== 'string') {
      throw new HttpHeadersError('invalidValue', 'Header values must be strings')
    }

    normalized[key] = value
  })

  return toHeadersBlock(normalized)
}
