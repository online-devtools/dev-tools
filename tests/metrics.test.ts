import { describe, expect, it } from 'vitest'
import { calculateLatencyStats } from '@/utils/metrics'

// Latency statistics should match standard percentile calculations.
describe('metrics utils', () => {
  it('computes min, max, average, median, and p95', () => {
    // Use a small deterministic sample set.
    const stats = calculateLatencyStats([10, 20, 30, 40, 50])

    expect(stats.min).toBe(10)
    expect(stats.max).toBe(50)
    expect(stats.avg).toBe(30)
    expect(stats.median).toBe(30)
    expect(stats.p95).toBe(50)
  })
})
