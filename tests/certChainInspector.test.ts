import { describe, expect, it } from 'vitest'
import { inspectCertificateChain } from '@/utils/certChainInspector'

// Certificate chain inspector should parse PEM blocks and compute fingerprints.
describe('certChainInspector utils', () => {
  it('returns fingerprints for PEM entries', async () => {
    const pem = [
      '-----BEGIN CERTIFICATE-----',
      'AQID',
      '-----END CERTIFICATE-----',
      '-----BEGIN CERTIFICATE-----',
      'BAUGBwgJ',
      '-----END CERTIFICATE-----',
    ].join('\n')

    const result = await inspectCertificateChain(pem)

    expect(result.summary.total).toBe(2)
    expect(result.summary.duplicates).toBe(0)
    result.certificates.forEach((cert) => {
      expect(cert.fingerprintSha256).toMatch(/^[A-F0-9]{64}$/)
      expect(cert.derSize).toBeGreaterThan(0)
    })
  })

  it('flags duplicate certificates', async () => {
    const pem = [
      '-----BEGIN CERTIFICATE-----',
      'AQID',
      '-----END CERTIFICATE-----',
      '-----BEGIN CERTIFICATE-----',
      'AQID',
      '-----END CERTIFICATE-----',
    ].join('\n')

    const result = await inspectCertificateChain(pem)

    expect(result.summary.duplicates).toBe(1)
  })
})
