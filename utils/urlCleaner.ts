export type UrlCleanerOptions = {
  removeTracking: boolean
  removeEmpty: boolean
  sortQuery: boolean
}

export type UrlCleanerResult = {
  cleanedUrl: string
  removedParams: string[]
  keptParams: Array<{ key: string; value: string }>
}

export type UrlCleanerErrorCode = 'invalidUrl'

export class UrlCleanerError extends Error {
  code: UrlCleanerErrorCode

  constructor(code: UrlCleanerErrorCode, message: string) {
    super(message)
    this.name = 'UrlCleanerError'
    this.code = code
  }
}

const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'utm_reader',
  'utm_name',
  'utm_cid',
  'utm_sid',
  'gclid',
  'fbclid',
  'igshid',
  'mc_cid',
  'mc_eid',
  'ref',
  'ref_src',
  '_hsenc',
  '_hsmi',
  'vero_id',
  'mkt_tok',
]

const TRACKING_SET = new Set(TRACKING_PARAMS.map((param) => param.toLowerCase()))

const normalizeUrl = (value: string): URL => {
  try {
    return new URL(value)
  } catch (error) {
    // If the scheme is missing but the input looks like a host, try https://.
    if (!value.startsWith('http://') && !value.startsWith('https://') && value.includes('.')) {
      try {
        return new URL(`https://${value}`)
      } catch {
        // Fall through to the error below for invalid host strings.
      }
    }
    const message = error instanceof Error ? error.message : 'Invalid URL'
    throw new UrlCleanerError('invalidUrl', message)
  }
}

export const cleanUrl = (input: string, options: UrlCleanerOptions): UrlCleanerResult => {
  const url = normalizeUrl(input.trim())
  const entries = Array.from(url.searchParams.entries())
  const removedParams: string[] = []
  const keptParams: Array<{ key: string; value: string }> = []

  entries.forEach(([key, value]) => {
    const normalizedKey = key.toLowerCase()
    const shouldRemoveTracking = options.removeTracking && TRACKING_SET.has(normalizedKey)
    const shouldRemoveEmpty = options.removeEmpty && value.trim() === ''

    if (shouldRemoveTracking || shouldRemoveEmpty) {
      removedParams.push(key)
      return
    }

    keptParams.push({ key, value })
  })

  const sortedParams = options.sortQuery
    ? [...keptParams].sort((a, b) => {
        if (a.key === b.key) {
          return a.value.localeCompare(b.value)
        }
        return a.key.localeCompare(b.key)
      })
    : keptParams

  const cleanedUrl = new URL(url.toString())
  cleanedUrl.search = ''
  sortedParams.forEach((param) => {
    cleanedUrl.searchParams.append(param.key, param.value)
  })

  return {
    cleanedUrl: cleanedUrl.toString(),
    removedParams,
    keptParams: sortedParams,
  }
}
