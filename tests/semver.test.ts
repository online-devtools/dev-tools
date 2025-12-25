import { describe, expect, it } from 'vitest'
import { compareSemver, parseSemver, sortSemverList, SemverError } from '@/utils/semver'

// SemVer comparisons are used in release pipelines, so we validate ordering rules.
describe('semver utils', () => {
  it('parses a standard semver string', () => {
    expect(parseSemver('1.2.3')).toMatchObject({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: [],
      build: [],
    })
  })

  it('parses semver strings with v prefix and prerelease/build metadata', () => {
    expect(parseSemver('v2.0.1-beta.3+build.9')).toMatchObject({
      major: 2,
      minor: 0,
      patch: 1,
      prerelease: ['beta', 3],
      build: ['build', '9'],
    })
  })

  it('orders prerelease lower than the corresponding release', () => {
    expect(compareSemver('1.0.0-alpha', '1.0.0')).toBeLessThan(0)
  })

  it('orders numeric prerelease identifiers numerically', () => {
    expect(compareSemver('1.0.0-alpha.2', '1.0.0-alpha.10')).toBeLessThan(0)
  })

  it('orders numeric identifiers lower than non-numeric', () => {
    expect(compareSemver('1.0.0-alpha.1', '1.0.0-alpha.beta')).toBeLessThan(0)
  })

  it('sorts a list of versions ascending', () => {
    const input = ['1.0.0', '1.0.0-alpha', '2.0.0', '1.1.0']

    expect(sortSemverList(input)).toEqual(['1.0.0-alpha', '1.0.0', '1.1.0', '2.0.0'])
  })

  it('throws a structured error for invalid versions', () => {
    try {
      parseSemver('not-a-version')
      throw new Error('Expected parseSemver to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(SemverError)
      const typed = error as SemverError
      expect(typed.code).toBe('invalid')
    }
  })
})
