import { describe, it, expect } from 'vitest'
import { buildCsv, parseHeaderLines, ResponseSample } from '@/utils/apiResponseTime'

describe('apiResponseTime helpers', () => {
  it('parses header text into a fetch-compatible object', () => {
    // Provide mixed whitespace and an invalid line to confirm parsing is robust.
    const input = [
      'Content-Type: application/json',
      ' Authorization: Bearer token ',
      '',
      'InvalidLine',
      'X-Test: A:B',
    ].join('\n')

    const result = parseHeaderLines(input)

    expect(result).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
      'X-Test': 'A:B',
    })
  })

  it('builds a CSV export with escaped error text', () => {
    // Sample payload includes an error that contains quotes to validate escaping.
    const samples: ResponseSample[] = [
      { index: 1, durationMs: 120.456, status: 200, ok: true },
      { index: 2, durationMs: 98.1, ok: false, error: 'Boom "fail"' },
    ]

    const csv = buildCsv(samples)
    const lines = csv.split('\n')

    expect(lines[0]).toBe('index,status,ok,duration_ms,error')
    expect(lines[1]).toBe('1,200,true,120.46,')
    expect(lines[2]).toBe('2,,false,98.10,"Boom ""fail"""')
  })
})
