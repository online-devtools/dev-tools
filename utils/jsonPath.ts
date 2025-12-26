// JSONPath listing helper to turn nested JSON into path/value pairs.
// This is used by the JSONPath Finder UI to surface copyable paths.

export type JsonPathErrorCode = 'empty' | 'invalidJson'

export class JsonPathError extends Error {
  code: JsonPathErrorCode

  constructor(code: JsonPathErrorCode, message: string) {
    super(message)
    this.name = 'JsonPathError'
    this.code = code
  }
}

export type JsonPathEntry = {
  path: string
  value: unknown
}

const ensureNotEmpty = (input: string) => {
  // Empty input should raise a dedicated error for UI messaging.
  if (!input.trim()) {
    throw new JsonPathError('empty', 'Input is empty')
  }
}

const parseJson = (input: string): unknown => {
  // Wrap JSON.parse so invalid JSON produces a custom error type.
  try {
    return JSON.parse(input)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON'
    throw new JsonPathError('invalidJson', message)
  }
}

const isSimpleKey = (key: string): boolean => {
  // Simple keys can be represented with dot notation.
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)
}

const escapeKey = (key: string): string => {
  // JSONPath bracket notation uses single quotes, so escape single quotes and backslashes.
  return key.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')
}

export const listJsonPaths = (input: string): JsonPathEntry[] => {
  ensureNotEmpty(input)
  const data = parseJson(input)

  const entries: JsonPathEntry[] = []

  const walk = (value: unknown, currentPath: string) => {
    // Arrays are expanded by index so each element is a leaf path candidate.
    if (Array.isArray(value)) {
      if (value.length === 0) {
        entries.push({ path: currentPath, value })
        return
      }
      value.forEach((item, index) => {
        walk(item, `${currentPath}[${index}]`)
      })
      return
    }

    // Objects are traversed key-by-key with dot or bracket notation.
    if (value && typeof value === 'object') {
      const objectValue = value as Record<string, unknown>
      const keys = Object.keys(objectValue)
      if (keys.length === 0) {
        entries.push({ path: currentPath, value })
        return
      }
      keys.forEach((key) => {
        const nextPath = isSimpleKey(key)
          ? `${currentPath}.${key}`
          : `${currentPath}['${escapeKey(key)}']`
        walk(objectValue[key], nextPath)
      })
      return
    }

    // Primitive values are recorded as leaf nodes.
    entries.push({ path: currentPath, value })
  }

  // Root path starts at "$" for JSONPath syntax.
  walk(data, '$')
  return entries
}
