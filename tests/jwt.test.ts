import { describe, expect, it } from 'vitest'
import { createSignedJwt } from '@/utils/jwt'

describe('jwt utils', () => {
  it('creates deterministic HS256 token like jwt.io sample', () => {
    const { token } = createSignedJwt({
      header: {},
      payload: {
        sub: '1234567890',
        name: 'John Doe',
        admin: true,
      },
      secret: 'secret',
      algorithm: 'HS256',
    })

    expect(token).toBe(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.' +
        'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ'
    )
  })

  it('requires a secret value', () => {
    expect(() =>
      createSignedJwt({
        header: {},
        payload: {},
        secret: '   ',
        algorithm: 'HS256',
      })
    ).toThrowError('jwtSigner.error.secretRequired')
  })
})

