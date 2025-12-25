// Lightweight SemVer parser and comparator for client-side use without extra dependencies.
// This implementation follows the SemVer 2.0.0 precedence rules.

export type SemverIdentifier = string | number

export interface Semver {
  raw: string
  major: number
  minor: number
  patch: number
  prerelease: SemverIdentifier[]
  build: string[]
}

export type SemverErrorCode = 'empty' | 'invalid'

export class SemverError extends Error {
  code: SemverErrorCode

  constructor(code: SemverErrorCode, message: string) {
    super(message)
    this.name = 'SemverError'
    this.code = code
  }
}

const SEMVER_PATTERN = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/

const parseIdentifiers = (value?: string): SemverIdentifier[] => {
  if (!value) return []
  return value.split('.').map((part) => (/^\d+$/.test(part) ? Number(part) : part))
}

const parseBuild = (value?: string): string[] => {
  if (!value) return []
  return value.split('.')
}

export const parseSemver = (input: string): Semver => {
  const trimmed = input.trim()
  if (!trimmed) {
    throw new SemverError('empty', 'Input is empty')
  }

  const match = trimmed.match(SEMVER_PATTERN)
  if (!match) {
    throw new SemverError('invalid', 'Invalid semantic version')
  }

  const [, major, minor, patch, prerelease, build] = match

  return {
    raw: trimmed,
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    prerelease: parseIdentifiers(prerelease),
    build: parseBuild(build),
  }
}

const compareIdentifiers = (a: SemverIdentifier, b: SemverIdentifier): number => {
  const aIsNumber = typeof a === 'number'
  const bIsNumber = typeof b === 'number'

  if (aIsNumber && bIsNumber) {
    return a - b
  }

  // Numeric identifiers have lower precedence than non-numeric ones.
  if (aIsNumber && !bIsNumber) {
    return -1
  }
  if (!aIsNumber && bIsNumber) {
    return 1
  }

  return String(a).localeCompare(String(b))
}

const comparePrerelease = (a: SemverIdentifier[], b: SemverIdentifier[]): number => {
  // If both are empty, they are equal (release versions).
  if (a.length === 0 && b.length === 0) return 0

  // A release version has higher precedence than a prerelease.
  if (a.length === 0) return 1
  if (b.length === 0) return -1

  const max = Math.max(a.length, b.length)
  for (let i = 0; i < max; i += 1) {
    const left = a[i]
    const right = b[i]

    if (left === undefined) return -1
    if (right === undefined) return 1

    const cmp = compareIdentifiers(left, right)
    if (cmp !== 0) return cmp
  }

  return 0
}

export const compareSemver = (left: string, right: string): number => {
  const a = parseSemver(left)
  const b = parseSemver(right)

  if (a.major !== b.major) return a.major - b.major
  if (a.minor !== b.minor) return a.minor - b.minor
  if (a.patch !== b.patch) return a.patch - b.patch

  // Build metadata is ignored for precedence; only prerelease is considered.
  return comparePrerelease(a.prerelease, b.prerelease)
}

export const sortSemverList = (versions: string[]): string[] => {
  // Create a copy to keep input immutable for React state usage.
  return [...versions].sort((a, b) => compareSemver(a, b))
}
