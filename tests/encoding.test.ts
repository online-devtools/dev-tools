import { describe, expect, it } from 'vitest'
import { decodeBase64, encodeBase64 } from '@/utils/encoding'

describe('encoding utils', () => {
  it('encodes UTF-8 text', () => {
    expect(encodeBase64('안녕하세요')).toBe('7JWI64WV7ZWY7IS47JqU')
  })

  it('decodes UTF-8 text', () => {
    expect(decodeBase64('7JWI64WV7ZWY7IS47JqU')).toBe('안녕하세요')
  })

  it('round-trips emoji characters', () => {
    const sample = '🛠️ Dev Tools'
    expect(decodeBase64(encodeBase64(sample))).toBe(sample)
  })

  it('throws for invalid decode input', () => {
    expect(() => decodeBase64('@@invalid@@')).toThrow()
  })
})

