// JSON flatten/unflatten helpers so UI and tests share the same parsing rules.
// The focus is on deterministic, backend-friendly conversions with explicit error codes.

export type JsonFlattenErrorCode = 'empty' | 'invalidJson' | 'notObject' | 'invalidPath'

export class JsonFlattenError extends Error {
  code: JsonFlattenErrorCode
  path?: string

  constructor(code: JsonFlattenErrorCode, message: string, path?: string) {
    super(message)
    this.name = 'JsonFlattenError'
    this.code = code
    this.path = path
  }
}

const ensureNotEmpty = (input: string) => {
  // Treat blank input as a distinct error so the UI can show a specific hint.
  if (!input.trim()) {
    throw new JsonFlattenError('empty', 'Input is empty')
  }
}

const parseJson = (input: string): unknown => {
  // Parse JSON with a dedicated error so callers do not need to handle JSON.parse exceptions.
  try {
    return JSON.parse(input)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON'
    throw new JsonFlattenError('invalidJson', message)
  }
}

const isNonNullObject = (value: unknown): value is Record<string, unknown> => {
  // Arrays are objects too, but we handle them separately in the flatten walk.
  return typeof value === 'object' && value !== null
}

const parsePathTokens = (path: string): Array<string | number> => {
  // Convert "a.b[0].c" into ["a", "b", 0, "c"] for iterative traversal.
  if (!path) {
    throw new JsonFlattenError('invalidPath', 'Path is empty', path)
  }

  const tokens: Array<string | number> = []
  let index = 0

  while (index < path.length) {
    const char = path[index]

    if (char === '.') {
      // A dot cannot be the first character, nor can two dots appear in a row.
      if (index === 0 || path[index - 1] === '.' || path[index - 1] === '[') {
        throw new JsonFlattenError('invalidPath', 'Invalid dot placement', path)
      }
      // A dot must be followed by a key, not a bracket or end-of-string.
      if (index + 1 >= path.length || path[index + 1] === '[' || path[index + 1] === '.') {
        throw new JsonFlattenError('invalidPath', 'Invalid dot placement', path)
      }
      index += 1
      continue
    }

    if (char === '[') {
      // Brackets denote array indexes and must contain at least one digit.
      const start = index + 1
      let cursor = start

      while (cursor < path.length && /[0-9]/.test(path[cursor])) {
        cursor += 1
      }

      if (cursor === start) {
        throw new JsonFlattenError('invalidPath', 'Array index is missing', path)
      }

      if (cursor >= path.length || path[cursor] !== ']') {
        throw new JsonFlattenError('invalidPath', 'Array index is not closed', path)
      }

      const rawIndex = path.slice(start, cursor)
      const arrayIndex = Number(rawIndex)

      tokens.push(arrayIndex)
      index = cursor + 1

      // After a bracket, only ".", another "[", or the end is valid.
      if (index < path.length && path[index] !== '.' && path[index] !== '[') {
        throw new JsonFlattenError('invalidPath', 'Invalid token after array index', path)
      }

      continue
    }

    // Parse a plain object key until a dot or bracket separator appears.
    let end = index
    while (end < path.length && path[end] !== '.' && path[end] !== '[') {
      end += 1
    }

    const key = path.slice(index, end)
    if (!key) {
      throw new JsonFlattenError('invalidPath', 'Object key is empty', path)
    }

    tokens.push(key)
    index = end
  }

  return tokens
}

export const flattenJson = (input: string): Record<string, unknown> => {
  ensureNotEmpty(input)

  const parsed = parseJson(input)
  if (!isNonNullObject(parsed)) {
    throw new JsonFlattenError('notObject', 'Expected a JSON object or array')
  }

  const result: Record<string, unknown> = {}

  const walk = (value: unknown, currentPath: string) => {
    // Arrays and objects are traversed recursively; primitives are written to the result.
    if (Array.isArray(value)) {
      if (value.length === 0 && currentPath) {
        // Preserve empty arrays in nested positions by writing the array itself.
        result[currentPath] = []
        return
      }
      value.forEach((item, itemIndex) => {
        const nextPath = currentPath ? `${currentPath}[${itemIndex}]` : `[${itemIndex}]`
        walk(item, nextPath)
      })
      return
    }

    if (isNonNullObject(value)) {
      const entries = Object.entries(value)
      if (entries.length === 0 && currentPath) {
        // Preserve empty objects in nested positions by writing the object itself.
        result[currentPath] = {}
        return
      }
      entries.forEach(([key, nestedValue]) => {
        const nextPath = currentPath ? `${currentPath}.${key}` : key
        walk(nestedValue, nextPath)
      })
      return
    }

    // Primitive values (string/number/boolean/null) are treated as leaf nodes.
    result[currentPath] = value
  }

  if (Array.isArray(parsed)) {
    // Root arrays are allowed; each index becomes a top-level token like "[0]".
    parsed.forEach((item, itemIndex) => {
      walk(item, `[${itemIndex}]`)
    })
  } else {
    // Root objects are flattened by walking each top-level key.
    Object.entries(parsed).forEach(([key, value]) => {
      walk(value, key)
    })
  }

  return result
}

export const unflattenJson = (input: string): unknown => {
  ensureNotEmpty(input)

  const parsed = parseJson(input)
  if (!isNonNullObject(parsed) || Array.isArray(parsed)) {
    // Unflattening expects a flat object map, not a list or primitive.
    throw new JsonFlattenError('notObject', 'Expected a flat JSON object')
  }

  const entries = Object.entries(parsed)
  if (entries.length === 0) {
    // An empty object has no paths to expand, so return an empty object.
    return {}
  }

  let root: unknown

  const ensureRoot = (shouldBeArray: boolean) => {
    // Initialize the root container based on the first token type.
    if (root === undefined) {
      root = shouldBeArray ? [] : {}
      return
    }
    if (shouldBeArray && !Array.isArray(root)) {
      throw new JsonFlattenError('invalidPath', 'Root expects an array', '')
    }
    if (!shouldBeArray && Array.isArray(root)) {
      throw new JsonFlattenError('invalidPath', 'Root expects an object', '')
    }
  }

  entries.forEach(([path, value]) => {
    const tokens = parsePathTokens(path)
    ensureRoot(typeof tokens[0] === 'number')

    let cursor: any = root

    tokens.forEach((token, tokenIndex) => {
      const isLast = tokenIndex === tokens.length - 1
      const nextToken = !isLast ? tokens[tokenIndex + 1] : undefined
      const nextIsArray = typeof nextToken === 'number'

      if (typeof token === 'string') {
        if (isLast) {
          cursor[token] = value
          return
        }

        if (cursor[token] === undefined) {
          cursor[token] = nextIsArray ? [] : {}
        } else if (nextIsArray && !Array.isArray(cursor[token])) {
          throw new JsonFlattenError('invalidPath', 'Expected an array container', path)
        } else if (!nextIsArray && Array.isArray(cursor[token])) {
          throw new JsonFlattenError('invalidPath', 'Expected an object container', path)
        }

        cursor = cursor[token]
        return
      }

      // Numeric tokens represent array indexes; cursor must already be an array.
      if (!Array.isArray(cursor)) {
        throw new JsonFlattenError('invalidPath', 'Array index used on a non-array', path)
      }

      if (isLast) {
        cursor[token] = value
        return
      }

      if (cursor[token] === undefined) {
        cursor[token] = nextIsArray ? [] : {}
      } else if (nextIsArray && !Array.isArray(cursor[token])) {
        throw new JsonFlattenError('invalidPath', 'Expected an array container', path)
      } else if (!nextIsArray && Array.isArray(cursor[token])) {
        throw new JsonFlattenError('invalidPath', 'Expected an object container', path)
      }

      cursor = cursor[token]
    })
  })

  return root ?? {}
}

export const toFlattenedJsonString = (input: string): string => {
  // Flatten the JSON string and return a pretty JSON payload for UI readability.
  const flattened = flattenJson(input)
  return JSON.stringify(flattened, null, 2)
}

export const toNestedJsonString = (input: string): string => {
  // Expand the flattened JSON and return a pretty JSON payload for UI readability.
  const nested = unflattenJson(input)
  return JSON.stringify(nested, null, 2)
}
