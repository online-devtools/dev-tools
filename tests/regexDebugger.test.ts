import { describe, expect, it } from 'vitest'
import { RegexDebuggerError, analyzeRegexMatches } from '@/utils/regexDebugger'

// Regex debugging should report matches and capture groups deterministically.
describe('regexDebugger utils', () => {
  it('returns matches with groups and indexes', () => {
    // Use a simple word-capture regex to verify match listing.
    const matches = analyzeRegexMatches('(\\w+)', 'g', 'hello world')

    expect(matches).toEqual([
      { index: 0, match: 'hello', groups: ['hello'], namedGroups: {} },
      { index: 6, match: 'world', groups: ['world'], namedGroups: {} },
    ])
  })

  it('throws a structured error for invalid regex patterns', () => {
    try {
      // Invalid regex syntax should be reported with a custom error.
      analyzeRegexMatches('(', 'g', 'test')
      throw new Error('Expected analyzeRegexMatches to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(RegexDebuggerError)
      const typed = error as RegexDebuggerError
      expect(typed.code).toBe('invalidPattern')
    }
  })
})
