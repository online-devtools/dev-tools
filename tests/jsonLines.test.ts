import { describe, expect, it } from 'vitest'
import {
  JsonLinesError,
  parseJsonLines,
  parseJsonArray,
  toJsonArrayString,
  toJsonLinesString,
} from '@/utils/jsonLines'

// Validate JSON Lines <-> JSON Array conversion so tooling can be trusted in data pipelines.
describe('jsonLines utils', () => {
  it('parses JSON Lines into an array', () => {
    const input = '{"a":1}\n{"b":2}\n\n{"c":3}'

    expect(parseJsonLines(input)).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }])
  })

  it('throws a structured error when a line is invalid JSON', () => {
    const input = '{"a":1}\n{invalid}\n{"c":3}'

    try {
      parseJsonLines(input)
      throw new Error('Expected parseJsonLines to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(JsonLinesError)
      const typed = error as JsonLinesError
      expect(typed.code).toBe('invalidLine')
      expect(typed.line).toBe(2)
    }
  })

  it('parses a JSON array string into an array', () => {
    const input = '[{"a":1},{"b":2}]'

    expect(parseJsonArray(input)).toEqual([{ a: 1 }, { b: 2 }])
  })

  it('converts JSON Lines to a pretty JSON array string', () => {
    const input = '{"a":1}\n{"b":2}'

    expect(toJsonArrayString(input)).toBe('[\n  {\n    "a": 1\n  },\n  {\n    "b": 2\n  }\n]')
  })

  it('converts JSON array string to JSON Lines', () => {
    const input = '[{"a":1},{"b":2}]'

    expect(toJsonLinesString(input)).toBe('{"a":1}\n{"b":2}')
  })
})
