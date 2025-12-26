// Utility for parsing responsive breakpoint input strings.
// Keeping this in a helper makes it easy to test and reuse.

export const parseBreakpoints = (input: string): number[] => {
  // Split by comma, trim whitespace, and keep only positive numbers.
  const values = input
    .split(',')
    .map((raw) => Number(raw.trim()))
    .filter((value) => Number.isFinite(value) && value > 0)

  // Deduplicate and sort ascending for predictable preview ordering.
  return Array.from(new Set(values)).sort((a, b) => a - b)
}
