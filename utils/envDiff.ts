// .env parsing and diff helpers to compare environment files consistently.
// This file centralizes parsing rules so UI and tests stay in sync.

export type EnvDiffErrorCode = 'empty' | 'invalidLine'

export class EnvDiffError extends Error {
  code: EnvDiffErrorCode
  line?: number

  constructor(code: EnvDiffErrorCode, message: string, line?: number) {
    super(message)
    this.name = 'EnvDiffError'
    this.code = code
    this.line = line
  }
}

type ParseEnvOptions = {
  allowEmpty?: boolean
}

const ensureNotEmpty = (input: string, options?: ParseEnvOptions) => {
  // Allow empty input only when explicitly requested (e.g., diffing against an empty file).
  if (!input.trim()) {
    if (options?.allowEmpty) {
      return
    }
    throw new EnvDiffError('empty', 'Input is empty')
  }
}

const normalizeValue = (rawValue: string): string => {
  // Strip surrounding quotes while preserving inner content.
  const trimmed = rawValue.trim()
  if (trimmed.length >= 2) {
    const first = trimmed[0]
    const last = trimmed[trimmed.length - 1]
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return trimmed.slice(1, -1)
    }
  }
  return trimmed
}

export const parseEnv = (input: string, options?: ParseEnvOptions): Record<string, string> => {
  ensureNotEmpty(input, options)

  const result: Record<string, string> = {}
  const lines = input.split(/\r?\n/)

  lines.forEach((line, index) => {
    const trimmed = line.trim()

    // Skip empty lines and pure comment lines.
    if (!trimmed || trimmed.startsWith('#')) {
      return
    }

    // Support "export KEY=VALUE" by stripping the export prefix first.
    const withoutExport = trimmed.replace(/^export\s+/, '')
    const separatorIndex = withoutExport.indexOf('=')

    if (separatorIndex <= 0) {
      // Missing "=" or empty key should trigger a structured error.
      throw new EnvDiffError('invalidLine', 'Missing "=" separator', index + 1)
    }

    const rawKey = withoutExport.slice(0, separatorIndex).trim()
    const rawValue = withoutExport.slice(separatorIndex + 1)

    if (!rawKey) {
      throw new EnvDiffError('invalidLine', 'Key is empty', index + 1)
    }

    result[rawKey] = normalizeValue(rawValue)
  })

  return result
}

export type EnvDiffResult = {
  added: string[]
  removed: string[]
  changed: string[]
  unchanged: string[]
  left: Record<string, string>
  right: Record<string, string>
}

export const diffEnv = (leftInput: string, rightInput: string): EnvDiffResult => {
  // Allow empty blocks so users can diff against a blank environment.
  const left = parseEnv(leftInput, { allowEmpty: true })
  const right = parseEnv(rightInput, { allowEmpty: true })

  const leftKeys = new Set(Object.keys(left))
  const rightKeys = new Set(Object.keys(right))
  const allKeys = new Set([...leftKeys, ...rightKeys])

  const added: string[] = []
  const removed: string[] = []
  const changed: string[] = []
  const unchanged: string[] = []

  allKeys.forEach((key) => {
    const inLeft = leftKeys.has(key)
    const inRight = rightKeys.has(key)

    if (inLeft && !inRight) {
      removed.push(key)
      return
    }

    if (!inLeft && inRight) {
      added.push(key)
      return
    }

    if (left[key] !== right[key]) {
      changed.push(key)
      return
    }

    unchanged.push(key)
  })

  // Sort arrays to keep output stable for UI rendering and tests.
  const sortKeys = (items: string[]) => items.sort((a, b) => a.localeCompare(b))

  return {
    added: sortKeys(added),
    removed: sortKeys(removed),
    changed: sortKeys(changed),
    unchanged: sortKeys(unchanged),
    left,
    right,
  }
}
