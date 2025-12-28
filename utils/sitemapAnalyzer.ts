import { XMLParser, XMLValidator } from 'fast-xml-parser'

export type SitemapEntry = {
  loc: string
  lastmod?: string
}

export type SitemapAnalysisType = 'urlset' | 'sitemapindex'

export type SitemapSummary = {
  total: number
  duplicates: number
  missingLastmod: number
}

export type SitemapAnalysis = {
  type: SitemapAnalysisType
  entries: SitemapEntry[]
  summary: SitemapSummary
  warnings: string[]
}

export type SitemapAnalyzerErrorCode = 'emptyInput' | 'invalidXml' | 'unsupportedFormat'

export class SitemapAnalyzerError extends Error {
  code: SitemapAnalyzerErrorCode

  constructor(code: SitemapAnalyzerErrorCode, message: string) {
    super(message)
    this.name = 'SitemapAnalyzerError'
    this.code = code
  }
}

// Create a single XML parser instance with predictable output for sitemap XML.
const parser = new XMLParser({
  ignoreAttributes: true,
  removeNSPrefix: true,
  trimValues: true,
})

const toArray = <T>(value: T | T[] | undefined): T[] => {
  // Normalize possibly-single entries into arrays for easier iteration.
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

const readText = (value: unknown): string => {
  // Extract string content from parser outputs, including #text nodes.
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number') return String(value)
  if (value && typeof value === 'object' && '#text' in value) {
    return String((value as { '#text': unknown })['#text']).trim()
  }
  return ''
}

const summarizeEntries = (entries: SitemapEntry[]): SitemapSummary => {
  // Count duplicates and missing lastmod values for quick insight.
  const seen = new Set<string>()
  let duplicates = 0
  let missingLastmod = 0

  entries.forEach((entry) => {
    const key = entry.loc
    if (!key) return
    if (seen.has(key)) {
      duplicates += 1
    } else {
      seen.add(key)
    }
    if (!entry.lastmod) {
      missingLastmod += 1
    }
  })

  return {
    total: entries.length,
    duplicates,
    missingLastmod,
  }
}

export const analyzeSitemapXml = (xml: string): SitemapAnalysis => {
  // Ensure we have input before parsing to avoid unclear parser errors.
  if (!xml.trim()) {
    throw new SitemapAnalyzerError('emptyInput', 'Sitemap XML is empty.')
  }

  let parsed: Record<string, unknown>
  try {
    const validation = XMLValidator.validate(xml)
    if (validation !== true) {
      throw new SitemapAnalyzerError('invalidXml', validation.err?.msg ?? 'Invalid XML')
    }
    parsed = parser.parse(xml)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid XML'
    throw new SitemapAnalyzerError('invalidXml', message)
  }

  const warnings: string[] = []

  if ('urlset' in parsed && parsed.urlset) {
    const urlset = parsed.urlset as { url?: unknown }
    const entries = toArray(urlset.url).map((entry) => {
      const record = entry as { loc?: unknown; lastmod?: unknown }
      const loc = readText(record.loc)
      const lastmod = readText(record.lastmod)
      if (!loc) {
        warnings.push('Found a URL entry without a loc value.')
      }
      return {
        loc,
        lastmod: lastmod || undefined,
      }
    })

    return {
      type: 'urlset',
      entries,
      summary: summarizeEntries(entries),
      warnings,
    }
  }

  if ('sitemapindex' in parsed && parsed.sitemapindex) {
    const sitemapindex = parsed.sitemapindex as { sitemap?: unknown }
    const entries = toArray(sitemapindex.sitemap).map((entry) => {
      const record = entry as { loc?: unknown; lastmod?: unknown }
      const loc = readText(record.loc)
      const lastmod = readText(record.lastmod)
      if (!loc) {
        warnings.push('Found a sitemap entry without a loc value.')
      }
      return {
        loc,
        lastmod: lastmod || undefined,
      }
    })

    return {
      type: 'sitemapindex',
      entries,
      summary: summarizeEntries(entries),
      warnings,
    }
  }

  // If neither root element is present, the sitemap format is unsupported.
  throw new SitemapAnalyzerError('unsupportedFormat', 'Unsupported sitemap format.')
}
