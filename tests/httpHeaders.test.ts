import { describe, expect, it } from 'vitest'
import {
  HttpHeadersError,
  parseHeadersBlock,
  toHeadersBlock,
  toHeadersJsonString,
  toHeadersBlockFromJson,
} from '@/utils/httpHeaders'

// HTTP header parsing is a common backend workflow, so we lock down edge cases with tests.
describe('httpHeaders utils', () => {
  it('parses a headers block into an object', () => {
    const input = 'Content-Type: application/json\nX-Trace-Id: abc123'

    expect(parseHeadersBlock(input)).toEqual({
      'Content-Type': 'application/json',
      'X-Trace-Id': 'abc123',
    })
  })

  it('aggregates duplicate headers into an array', () => {
    const input = 'Set-Cookie: a=1\nSet-Cookie: b=2'

    expect(parseHeadersBlock(input)).toEqual({
      'Set-Cookie': ['a=1', 'b=2'],
    })
  })

  it('throws a structured error when a line is missing a colon', () => {
    const input = 'Authorization Bearer token'

    try {
      parseHeadersBlock(input)
      throw new Error('Expected parseHeadersBlock to throw')
    } catch (error) {
      expect(error).toBeInstanceOf(HttpHeadersError)
      const typed = error as HttpHeadersError
      expect(typed.code).toBe('invalidLine')
      expect(typed.line).toBe(1)
    }
  })

  it('stringifies an object back to a headers block', () => {
    const headers = {
      Accept: 'application/json',
      'Set-Cookie': ['a=1', 'b=2'],
    }

    expect(toHeadersBlock(headers)).toBe('Accept: application/json\nSet-Cookie: a=1\nSet-Cookie: b=2')
  })

  it('converts a headers block to JSON', () => {
    const input = 'Content-Type: application/json'

    expect(toHeadersJsonString(input)).toBe('{\n  "Content-Type": "application/json"\n}')
  })

  it('converts JSON back to a headers block', () => {
    const input = '{ "Authorization": "Bearer token" }'

    expect(toHeadersBlockFromJson(input)).toBe('Authorization: Bearer token')
  })
})
