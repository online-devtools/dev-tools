import { describe, expect, it } from 'vitest'
import { runRegexTest } from '@/utils/regex'

describe('regex utils', () => {
  it('matches multiple occurrences', () => {
    const { matches, hasMatches } = runRegexTest('\\d+', 'g', 'abc123def45')
    expect(hasMatches).toBe(true)
    expect(matches).toEqual(['123', '45'])
  })

  it('reports no matches when none exist', () => {
    const { hasMatches, matches } = runRegexTest('xyz', '', 'abc')
    expect(hasMatches).toBe(false)
    expect(matches).toEqual([])
  })

  it('throws when pattern missing', () => {
    expect(() => runRegexTest('', 'g', 'abc')).toThrowError('regex.error.required')
  })

  it('throws for invalid regex syntax', () => {
    expect(() => runRegexTest('[', '', 'abc')).toThrow()
  })
})
