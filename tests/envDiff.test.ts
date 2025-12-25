import { describe, expect, it } from 'vitest'
import { EnvDiffError, diffEnv, parseEnv } from '@/utils/envDiff'

// .env diffing is common in deployment reviews, so we lock down behavior here.
describe('envDiff utils', () => {
  it('parses .env files into key/value pairs', () => {
    // Comments and blank lines should be ignored by the parser.
    const input = '# Comment\nAPI_KEY=abc123\n\nPORT=3000'

    // Expect the parser to return only key/value pairs.
    expect(parseEnv(input)).toEqual({
      API_KEY: 'abc123',
      PORT: '3000',
    })
  })

  it('diffs two env blocks and reports added/removed/changed', () => {
    // Define a left/right env snapshot for comparison.
    const left = 'API_KEY=abc123\nPORT=3000'
    const right = 'PORT=3001\nNEW_FEATURE=true'

    // Compute the diff so we can assert each diff bucket.
    const result = diffEnv(left, right)

    // The result should categorize keys accurately.
    expect(result.added).toEqual(['NEW_FEATURE'])
    expect(result.removed).toEqual(['API_KEY'])
    expect(result.changed).toEqual(['PORT'])
    expect(result.unchanged).toEqual([])
  })

  it('throws a structured error when an invalid line is encountered', () => {
    try {
      // Supply an invalid line without an "=" delimiter.
      parseEnv('INVALID LINE')
      throw new Error('Expected parseEnv to throw')
    } catch (error) {
      // Assert the error type and code for UI mapping.
      expect(error).toBeInstanceOf(EnvDiffError)
      const typed = error as EnvDiffError
      expect(typed.code).toBe('invalidLine')
    }
  })
})
