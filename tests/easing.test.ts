import { describe, expect, it } from 'vitest'
import { sampleCubicBezier } from '@/utils/easing'

// Cubic-bezier sampling should include the start and end points.
describe('easing utils', () => {
  it('samples points on a cubic-bezier curve', () => {
    const points = sampleCubicBezier(0.25, 0.1, 0.25, 1, 2)

    expect(points[0]).toEqual({ x: 0, y: 0 })
    expect(points[points.length - 1]).toEqual({ x: 1, y: 1 })
  })
})
