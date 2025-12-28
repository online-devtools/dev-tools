import { describe, expect, it } from 'vitest'
import { compareDnsRecords } from '@/utils/dnsCompare'

// DNS compare should identify common and unique records.
describe('dnsCompare utils', () => {
  it('returns diffs between two record sets', () => {
    const left = [
      'example.com. 300 IN A 1.1.1.1',
      'example.com. 300 IN MX 10 mail.example.com.',
    ].join('\n')
    const right = [
      'example.com. 300 IN A 1.1.1.1',
      'example.com. 300 IN A 2.2.2.2',
    ].join('\n')

    const result = compareDnsRecords(left, right)

    expect(result.summary.onlyLeft).toBe(1)
    expect(result.summary.onlyRight).toBe(1)
    expect(result.summary.common).toBe(1)
  })

  it('ignores invalid lines', () => {
    const left = ['invalid line', 'example.com. IN A 1.1.1.1'].join('\n')
    const right = ['example.com. IN A 1.1.1.1'].join('\n')

    const result = compareDnsRecords(left, right)

    expect(result.summary.onlyLeft).toBe(0)
    expect(result.summary.common).toBe(1)
  })
})
