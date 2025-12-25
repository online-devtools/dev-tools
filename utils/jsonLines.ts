// JSON Lines utilities are shared between the UI and tests to keep conversion rules consistent.
// This file purposefully handles error codes so the UI can map them to localized messages.

export type JsonLinesErrorCode = 'empty' | 'invalidLine' | 'notArray' | 'stringify'

export class JsonLinesError extends Error {
  code: JsonLinesErrorCode
  line?: number

  constructor(code: JsonLinesErrorCode, message: string, line?: number) {
    super(message)
    this.name = 'JsonLinesError'
    this.code = code
    this.line = line
  }
}

const ensureNotEmpty = (input: string) => {
  // Empty input should fail fast so the UI can show a specific guidance message.
  if (!input.trim()) {
    throw new JsonLinesError('empty', 'Input is empty')
  }
}

export const parseJsonLines = (input: string): unknown[] => {
  ensureNotEmpty(input)

  const lines = input.split('\n')
  const items: unknown[] = []

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    // Empty lines are ignored so users can add spacing between records.
    if (!trimmed) return

    try {
      items.push(JSON.parse(trimmed))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid JSON'
      // Line numbers are 1-based for user-friendly error messages.
      throw new JsonLinesError('invalidLine', message, index + 1)
    }
  })

  return items
}

export const parseJsonArray = (input: string): unknown[] => {
  ensureNotEmpty(input)

  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON'
    throw new JsonLinesError('invalidLine', message)
  }

  if (!Array.isArray(parsed)) {
    throw new JsonLinesError('notArray', 'Expected a JSON array')
  }

  return parsed
}

export const toJsonArrayString = (input: string): string => {
  // Convert JSON Lines into a pretty JSON array string for readability.
  const items = parseJsonLines(input)
  return JSON.stringify(items, null, 2)
}

export const toJsonLinesString = (input: string): string => {
  // Convert a JSON array string into JSON Lines, one record per line.
  const items = parseJsonArray(input)

  const lines = items.map((item) => {
    const serialized = JSON.stringify(item)
    if (serialized === undefined) {
      // JSON.stringify returns undefined for unsupported values (e.g., functions or undefined).
      throw new JsonLinesError('stringify', 'Unable to stringify item')
    }
    return serialized
  })

  return lines.join('\n')
}
