// SAML decoding and parsing utilities for inspecting SAML requests/responses.
// Uses fast-xml-parser to avoid DOM dependencies in Node-based tests.

import { XMLParser } from 'fast-xml-parser'

export type SamlErrorCode = 'empty' | 'invalidBase64' | 'invalidXml'

export class SamlError extends Error {
  code: SamlErrorCode

  constructor(code: SamlErrorCode, message: string) {
    super(message)
    this.name = 'SamlError'
    this.code = code
  }
}

export type SamlParseResult = {
  issuer?: string
  nameId?: string
  audience?: string
  attributes: Record<string, string[]>
  rawXml: string
}

const ensureNotEmpty = (input: string) => {
  // Empty input is not useful for parsing and should fail early.
  if (!input.trim()) {
    throw new SamlError('empty', 'Input is empty')
  }
}

const decodeBase64 = (input: string): string => {
  // Strip whitespace so pasted blocks are handled correctly.
  const cleaned = input.replace(/\s+/g, '')

  try {
    if (typeof atob === 'function') {
      return atob(cleaned)
    }
    return Buffer.from(cleaned, 'base64').toString('utf-8')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid base64'
    throw new SamlError('invalidBase64', message)
  }
}

const normalizeInput = (input: string): string => {
  // Handle URL-encoded payloads by attempting decodeURIComponent.
  const trimmed = input.trim()
  if (/%[0-9A-Fa-f]{2}/.test(trimmed)) {
    try {
      return decodeURIComponent(trimmed)
    } catch {
      return trimmed
    }
  }
  return trimmed
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  removeNSPrefix: true,
})

const findFirstString = (node: unknown, keys: string[]): string | undefined => {
  // Walk nested objects to locate the first matching string value.
  if (!node || typeof node !== 'object') return undefined

  const record = node as Record<string, unknown>
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string') {
      return value
    }
    if (value && typeof value === 'object') {
      const nested = findFirstString(value, keys)
      if (nested) return nested
    }
  }

  // Continue searching through all child objects.
  for (const child of Object.values(record)) {
    if (child && typeof child === 'object') {
      const nested = findFirstString(child, keys)
      if (nested) return nested
    }
  }

  return undefined
}

const extractAttributes = (node: unknown): Record<string, string[]> => {
  // Extract AttributeStatement -> Attribute -> AttributeValue entries.
  const attributes: Record<string, string[]> = {}

  if (!node || typeof node !== 'object') return attributes

  const statements: unknown[] = []

  const collectStatements = (current: unknown) => {
    // Walk the tree and collect every AttributeStatement node.
    if (!current || typeof current !== 'object') return

    const record = current as Record<string, unknown>
    const localStatements = record.AttributeStatement

    if (localStatements) {
      if (Array.isArray(localStatements)) {
        statements.push(...localStatements)
      } else {
        statements.push(localStatements)
      }
    }

    Object.values(record).forEach((child) => {
      if (child && typeof child === 'object') {
        collectStatements(child)
      }
    })
  }

  collectStatements(node)

  statements.forEach((statement) => {
    const attributesNode = (statement as Record<string, unknown>).Attribute
    if (!attributesNode) return

    const attributeList = Array.isArray(attributesNode) ? attributesNode : [attributesNode]
    attributeList.forEach((attribute) => {
      const attrRecord = attribute as Record<string, unknown>
      const name = attrRecord.Name as string
      const values = attrRecord.AttributeValue
      const valueList = Array.isArray(values) ? values : values ? [values] : []

      if (name) {
        attributes[name] = valueList.map((value) => String(value))
      }
    })
  })

  return attributes
}

export const decodeSaml = (input: string): string => {
  ensureNotEmpty(input)
  const normalized = normalizeInput(input)

  // If the payload already looks like XML, return it directly.
  if (normalized.trim().startsWith('<')) {
    return normalized
  }

  return decodeBase64(normalized)
}

export const parseSamlXml = (xml: string): SamlParseResult => {
  ensureNotEmpty(xml)

  let parsed: Record<string, unknown>
  try {
    parsed = parser.parse(xml) as Record<string, unknown>
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid XML'
    throw new SamlError('invalidXml', message)
  }

  const issuer = findFirstString(parsed, ['Issuer'])
  const nameId = findFirstString(parsed, ['NameID'])
  const audience = findFirstString(parsed, ['Audience'])
  const attributes = extractAttributes(parsed)

  return {
    issuer,
    nameId,
    audience,
    attributes,
    rawXml: xml,
  }
}

export const decodeAndParseSaml = (input: string): SamlParseResult => {
  // Convenience helper for the UI to decode and parse in one step.
  const xml = decodeSaml(input)
  return parseSamlXml(xml)
}
