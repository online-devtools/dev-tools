import { HttpHeadersError, parseHeadersBlock } from './httpHeaders'

export type SecurityHeaderStatus = 'ok' | 'warn' | 'missing'

export type SecurityHeaderMessageCode =
  | 'present'
  | 'missing'
  | 'cspUnsafe'
  | 'hstsMissingMaxAge'
  | 'hstsLowMaxAge'
  | 'xctoInvalid'
  | 'xfoInvalid'
  | 'referrerWeak'
  | 'permissionsMissing'
  | 'coopMissing'
  | 'coepMissing'
  | 'corpMissing'

export type SecurityHeaderItem = {
  id: string
  header: string
  status: SecurityHeaderStatus
  value: string | null
  messageCode: SecurityHeaderMessageCode
  meta?: Record<string, string | number>
}

export type SecurityHeadersSummary = {
  ok: number
  warn: number
  missing: number
}

export type SecurityHeadersAnalysis = {
  items: SecurityHeaderItem[]
  summary: SecurityHeadersSummary
}

export type SecurityHeadersErrorCode = 'empty' | 'invalidLine'

export class SecurityHeadersError extends Error {
  code: SecurityHeadersErrorCode
  line?: number

  constructor(code: SecurityHeadersErrorCode, message: string, line?: number) {
    super(message)
    this.name = 'SecurityHeadersError'
    this.code = code
    this.line = line
  }
}

// Minimum max-age recommended for HSTS (180 days).
const HSTS_MIN_SECONDS = 15552000
// Acceptable X-Frame-Options values for clickjacking protection.
const ALLOWED_FRAME_OPTIONS = new Set(['deny', 'sameorigin'])
// A conservative set of Referrer-Policy values to recommend.
const RECOMMENDED_REFERRER = new Set([
  'no-referrer',
  'strict-origin',
  'strict-origin-when-cross-origin',
  'same-origin',
])

const normalizeHeaderMap = (input: string): Map<string, string> => {
  // Reuse the existing header parser and normalize keys for case-insensitive lookup.
  try {
    const parsed = parseHeadersBlock(input)
    const map = new Map<string, string>()

    Object.entries(parsed).forEach(([key, value]) => {
      const normalizedKey = key.toLowerCase()
      const normalizedValue = Array.isArray(value) ? value.join(', ') : value
      map.set(normalizedKey, normalizedValue)
    })

    return map
  } catch (error) {
    if (error instanceof HttpHeadersError) {
      if (error.code === 'empty') {
        throw new SecurityHeadersError('empty', 'Input is empty', error.line)
      }
      if (error.code === 'invalidLine') {
        throw new SecurityHeadersError('invalidLine', 'Invalid header line', error.line)
      }
    }

    throw new SecurityHeadersError('invalidLine', 'Invalid header input')
  }
}

const getHeaderValue = (headers: Map<string, string>, name: string): string | null => {
  // Normalize header names to lower case for stable lookups.
  const value = headers.get(name.toLowerCase())
  return value ?? null
}

const buildMissingItem = (
  id: string,
  header: string,
  required: boolean,
): SecurityHeaderItem => ({
  id,
  header,
  status: required ? 'missing' : 'warn',
  value: null,
  messageCode: required ? 'missing' : `${id}Missing` as SecurityHeaderMessageCode,
})

const checkCsp = (headers: Map<string, string>): SecurityHeaderItem => {
  // CSP is required for modern frontends; flag unsafe directives.
  const header = 'Content-Security-Policy'
  const value = getHeaderValue(headers, header)

  if (!value) {
    return buildMissingItem('csp', header, true)
  }

  const lowerValue = value.toLowerCase()
  const hasUnsafe = lowerValue.includes("'unsafe-inline'") || lowerValue.includes("'unsafe-eval'")

  if (hasUnsafe) {
    return {
      id: 'csp',
      header,
      status: 'warn',
      value,
      messageCode: 'cspUnsafe',
    }
  }

  return {
    id: 'csp',
    header,
    status: 'ok',
    value,
    messageCode: 'present',
  }
}

const checkHsts = (headers: Map<string, string>): SecurityHeaderItem => {
  // HSTS should enforce HTTPS with a sufficiently long max-age.
  const header = 'Strict-Transport-Security'
  const value = getHeaderValue(headers, header)

  if (!value) {
    return buildMissingItem('hsts', header, true)
  }

  const match = value.match(/max-age=(\d+)/i)
  if (!match) {
    return {
      id: 'hsts',
      header,
      status: 'warn',
      value,
      messageCode: 'hstsMissingMaxAge',
    }
  }

  const maxAge = Number(match[1])
  if (Number.isNaN(maxAge) || maxAge < HSTS_MIN_SECONDS) {
    return {
      id: 'hsts',
      header,
      status: 'warn',
      value,
      messageCode: 'hstsLowMaxAge',
      meta: { value: match[1] },
    }
  }

  return {
    id: 'hsts',
    header,
    status: 'ok',
    value,
    messageCode: 'present',
  }
}

const checkXContentTypeOptions = (headers: Map<string, string>): SecurityHeaderItem => {
  // X-Content-Type-Options should be "nosniff".
  const header = 'X-Content-Type-Options'
  const value = getHeaderValue(headers, header)

  if (!value) {
    return buildMissingItem('xcto', header, true)
  }

  if (value.toLowerCase() !== 'nosniff') {
    return {
      id: 'xcto',
      header,
      status: 'warn',
      value,
      messageCode: 'xctoInvalid',
    }
  }

  return {
    id: 'xcto',
    header,
    status: 'ok',
    value,
    messageCode: 'present',
  }
}

const checkFrameOptions = (headers: Map<string, string>): SecurityHeaderItem => {
  // X-Frame-Options should block clickjacking with DENY or SAMEORIGIN.
  const header = 'X-Frame-Options'
  const value = getHeaderValue(headers, header)

  if (!value) {
    return buildMissingItem('xfo', header, true)
  }

  if (!ALLOWED_FRAME_OPTIONS.has(value.toLowerCase())) {
    return {
      id: 'xfo',
      header,
      status: 'warn',
      value,
      messageCode: 'xfoInvalid',
    }
  }

  return {
    id: 'xfo',
    header,
    status: 'ok',
    value,
    messageCode: 'present',
  }
}

const checkReferrerPolicy = (headers: Map<string, string>): SecurityHeaderItem => {
  // Referrer-Policy should avoid leaking full URLs to third parties.
  const header = 'Referrer-Policy'
  const value = getHeaderValue(headers, header)

  if (!value) {
    return buildMissingItem('referrer', header, true)
  }

  if (!RECOMMENDED_REFERRER.has(value.toLowerCase())) {
    return {
      id: 'referrer',
      header,
      status: 'warn',
      value,
      messageCode: 'referrerWeak',
    }
  }

  return {
    id: 'referrer',
    header,
    status: 'ok',
    value,
    messageCode: 'present',
  }
}

const checkRecommendedHeader = (
  headers: Map<string, string>,
  id: string,
  header: string,
  missingCode: SecurityHeaderMessageCode,
): SecurityHeaderItem => {
  // Recommended headers are warnings when missing.
  const value = getHeaderValue(headers, header)
  if (!value) {
    return {
      id,
      header,
      status: 'warn',
      value: null,
      messageCode: missingCode,
    }
  }

  return {
    id,
    header,
    status: 'ok',
    value,
    messageCode: 'present',
  }
}

export const analyzeSecurityHeaders = (input: string): SecurityHeadersAnalysis => {
  // Analyze headers and return per-header statuses plus aggregate counts.
  const headers = normalizeHeaderMap(input)

  const items = [
    checkCsp(headers),
    checkHsts(headers),
    checkXContentTypeOptions(headers),
    checkFrameOptions(headers),
    checkReferrerPolicy(headers),
    checkRecommendedHeader(headers, 'permissions', 'Permissions-Policy', 'permissionsMissing'),
    checkRecommendedHeader(headers, 'coop', 'Cross-Origin-Opener-Policy', 'coopMissing'),
    checkRecommendedHeader(headers, 'coep', 'Cross-Origin-Embedder-Policy', 'coepMissing'),
    checkRecommendedHeader(headers, 'corp', 'Cross-Origin-Resource-Policy', 'corpMissing'),
  ]

  const summary = items.reduce<SecurityHeadersSummary>(
    (acc, item) => {
      acc[item.status] += 1
      return acc
    },
    { ok: 0, warn: 0, missing: 0 },
  )

  return { items, summary }
}
