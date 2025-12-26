// Latency statistics helpers for API response time charts.
// Provides percentile and median calculations for summary panels.

export type LatencyStats = {
  min: number
  max: number
  avg: number
  median: number
  p95: number
}

const percentile = (values: number[], p: number): number => {
  // Use a simple nearest-rank percentile calculation.
  if (values.length === 0) return 0

  const sorted = [...values].sort((a, b) => a - b)
  const rank = Math.ceil(p * sorted.length) - 1
  const index = Math.min(sorted.length - 1, Math.max(0, rank))
  return sorted[index]
}

const average = (values: number[]): number => {
  if (values.length === 0) return 0
  const total = values.reduce((sum, value) => sum + value, 0)
  return total / values.length
}

const median = (values: number[]): number => {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2
  }
  return sorted[mid]
}

export const calculateLatencyStats = (values: number[]): LatencyStats => {
  // Compute summary stats from the latency samples.
  return {
    min: values.length ? Math.min(...values) : 0,
    max: values.length ? Math.max(...values) : 0,
    avg: average(values),
    median: median(values),
    p95: percentile(values, 0.95),
  }
}
