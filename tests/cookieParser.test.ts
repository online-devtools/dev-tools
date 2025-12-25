import { describe, expect, it } from 'vitest'
import {
  CookieParserError,
  buildCookieHeader,
  parseCookieHeader,
  toCookieHeaderFromJson,
  toCookieJsonString,
} from '@/utils/cookieParser'

// Cookie parsing is a backend-heavy task, so we lock down behavior with explicit tests.
describe('cookieParser utils', () => {
  it('parses a Cookie header into a key/value map', () => {
    // Provide a standard Cookie header to validate trimming and splitting.
    const input = 'session=abc123; theme=dark'

    // Expect each cookie pair to become a property in the output map.
    expect(parseCookieHeader(input)).toEqual({
      session: 'abc123',
      theme: 'dark',
    })
  })

  it('ignores empty segments while parsing cookies', () => {
    // Extra semicolons should be treated as empty segments, not invalid pairs.
    const input = 'a=1; ; b=2'

    // Empty segments should not affect the parsed output.
    expect(parseCookieHeader(input)).toEqual({
      a: '1',
      b: '2',
    })
  })

  it('throws a structured error when the input is empty', () => {
    // Empty input should trigger the "empty" error code for UI messaging.
    try {
      // Use whitespace-only input to simulate a missing header.
      parseCookieHeader('   ')
      throw new Error('Expected parseCookieHeader to throw')
    } catch (error) {
      // Verify the error type and code so UI can map it.
      expect(error).toBeInstanceOf(CookieParserError)
      const typed = error as CookieParserError
      expect(typed.code).toBe('empty')
    }
  })

  it('throws a structured error when a cookie pair is invalid', () => {
    // Missing "=" should be reported as invalidPair.
    try {
      // Supply a token without "=" to trigger the invalidPair error.
      parseCookieHeader('invalid-cookie')
      throw new Error('Expected parseCookieHeader to throw')
    } catch (error) {
      // Assert the error is typed and includes the expected code.
      expect(error).toBeInstanceOf(CookieParserError)
      const typed = error as CookieParserError
      expect(typed.code).toBe('invalidPair')
    }
  })

  it('builds a Cookie header from a key/value object', () => {
    // Cookie builder should join pairs using the standard "; " separator.
    const header = buildCookieHeader({ session: 'abc123', theme: 'dark' })

    // The header string should match the expected ordering and separator.
    expect(header).toBe('session=abc123; theme=dark')
  })

  it('converts a Cookie header to a JSON string', () => {
    // This conversion mirrors how backend logs are normalized.
    const input = 'session=abc123'

    // The JSON output should be pretty-printed with two spaces.
    expect(toCookieJsonString(input)).toBe('{\n  "session": "abc123"\n}')
  })

  it('converts a JSON string into a Cookie header', () => {
    // JSON to header conversion is used when generating request headers.
    const input = '{ "theme": "dark" }'

    // The resulting header should be serialized to key=value format.
    expect(toCookieHeaderFromJson(input)).toBe('theme=dark')
  })
})
