import { describe, it, expect } from 'vitest'
import { parseBreakpoints } from '@/utils/breakpoints'

describe('parseBreakpoints', () => {
  it('filters invalid values and sorts ascending', () => {
    // Mix valid numbers with blanks and negatives to validate the filter.
    const result = parseBreakpoints('768, 320, -1, abc, 1024, 768')

    expect(result).toEqual([320, 768, 1024])
  })

  it('returns an empty list when no valid values are supplied', () => {
    // Provide only invalid input to confirm it safely returns an empty array.
    const result = parseBreakpoints('nope, -10, 0')

    expect(result).toEqual([])
  })
})
