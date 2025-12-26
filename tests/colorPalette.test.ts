import { describe, expect, it } from 'vitest'
import { extractDominantColors } from '@/utils/colorPalette'

// Color palette extraction should pick the most frequent colors deterministically.
describe('colorPalette utils', () => {
  it('extracts dominant colors from pixel data', () => {
    // Build a tiny pixel buffer with two red pixels and one blue pixel.
    const pixels = new Uint8ClampedArray([
      255, 0, 0, 255,
      255, 0, 0, 255,
      0, 0, 255, 255,
    ])

    const colors = extractDominantColors(pixels, 2, { quantizeBits: 8 })

    expect(colors).toEqual(['#ff0000', '#0000ff'])
  })
})
