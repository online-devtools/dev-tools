// Color palette extraction helpers for sampling dominant colors from pixel buffers.
// The algorithm uses a frequency histogram with optional quantization.

export type PaletteOptions = {
  sampleStep?: number
  quantizeBits?: number
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const toHex = (value: number): string => value.toString(16).padStart(2, '0')

const quantizeChannel = (value: number, bits: number): number => {
  // Quantize channel values to reduce color variety when extracting palettes.
  if (bits >= 8) return clamp(Math.round(value), 0, 255)

  const levels = Math.pow(2, bits)
  const step = 256 / levels
  const index = Math.min(levels - 1, Math.floor(value / step))
  const centered = Math.round(index * step + step / 2)
  return clamp(centered, 0, 255)
}

export const extractDominantColors = (
  pixels: Uint8ClampedArray,
  count: number,
  options?: PaletteOptions
): string[] => {
  const sampleStep = options?.sampleStep ?? 1
  const quantizeBits = options?.quantizeBits ?? 4

  const histogram = new Map<string, number>()

  // Walk the pixel buffer in RGBA order; skip transparent pixels.
  for (let i = 0; i < pixels.length; i += 4 * sampleStep) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]
    const a = pixels[i + 3]

    if (a === undefined || a < 10) {
      continue
    }

    const qr = quantizeChannel(r, quantizeBits)
    const qg = quantizeChannel(g, quantizeBits)
    const qb = quantizeChannel(b, quantizeBits)

    const key = `#${toHex(qr)}${toHex(qg)}${toHex(qb)}`
    histogram.set(key, (histogram.get(key) ?? 0) + 1)
  }

  return Array.from(histogram.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([color]) => color)
}
