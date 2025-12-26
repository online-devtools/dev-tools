// Package.json dependency parser for version checking tools.
// It validates JSON input and returns dependency maps.

export type DependencyParserErrorCode = 'empty' | 'invalidJson' | 'notObject'

export class DependencyParserError extends Error {
  code: DependencyParserErrorCode

  constructor(code: DependencyParserErrorCode, message: string) {
    super(message)
    this.name = 'DependencyParserError'
    this.code = code
  }
}

export type DependencyResult = {
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}

const ensureNotEmpty = (input: string) => {
  // Empty input should return a structured error for UI messaging.
  if (!input.trim()) {
    throw new DependencyParserError('empty', 'Input is empty')
  }
}

export const parsePackageJsonDependencies = (input: string): DependencyResult => {
  ensureNotEmpty(input)

  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON'
    throw new DependencyParserError('invalidJson', message)
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new DependencyParserError('notObject', 'Expected a JSON object')
  }

  const root = parsed as Record<string, unknown>
  const dependencies = (root.dependencies ?? {}) as Record<string, string>
  const devDependencies = (root.devDependencies ?? {}) as Record<string, string>

  return {
    dependencies,
    devDependencies,
  }
}
