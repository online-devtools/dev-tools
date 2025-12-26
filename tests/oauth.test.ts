import { describe, expect, it } from 'vitest'
import { generatePkceChallenge } from '@/utils/oauth'

// PKCE calculation must match the RFC 7636 test vector.
describe('oauth utils', () => {
  it('generates a code challenge from a known verifier', async () => {
    // RFC 7636 example verifier and expected challenge.
    const verifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'
    const challenge = await generatePkceChallenge(verifier)

    expect(challenge).toBe('E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM')
  })
})
