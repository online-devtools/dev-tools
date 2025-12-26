// Cubic-bezier sampling helpers for animation easing visualization.
// The curve always starts at (0,0) and ends at (1,1).

export type BezierPoint = {
  x: number
  y: number
}

const cubicBezierAt = (t: number, p0: number, p1: number, p2: number, p3: number): number => {
  // Standard cubic Bezier polynomial for a single axis.
  const oneMinus = 1 - t
  return (
    oneMinus * oneMinus * oneMinus * p0 +
    3 * oneMinus * oneMinus * t * p1 +
    3 * oneMinus * t * t * p2 +
    t * t * t * p3
  )
}

export const sampleCubicBezier = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  steps: number
): BezierPoint[] => {
  // Sample includes the endpoints, so we use steps + 1 segments.
  const points: BezierPoint[] = []
  const total = Math.max(1, steps)

  for (let i = 0; i <= total; i += 1) {
    const t = i / total
    const x = cubicBezierAt(t, 0, x1, x2, 1)
    const y = cubicBezierAt(t, 0, y1, y2, 1)
    points.push({ x, y })
  }

  return points
}
