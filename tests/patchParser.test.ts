import { describe, expect, it } from 'vitest'
import { parseUnifiedDiff } from '@/utils/patchParser'

// The unified diff parser should summarize files, hunks, and line changes.
describe('patchParser utils', () => {
  it('parses multi-file diff and counts additions/deletions', () => {
    // Build a git-like diff to validate parsing and counts.
    const input = [
      'diff --git a/foo.txt b/foo.txt',
      'index e69de29..4b825dc 100644',
      '--- a/foo.txt',
      '+++ b/foo.txt',
      '@@ -0,0 +1,2 @@',
      '+hello',
      '+world',
      'diff --git a/bar.txt b/bar.txt',
      '--- a/bar.txt',
      '+++ b/bar.txt',
      '@@ -1,2 +1,2 @@',
      '-line1',
      '+line1 updated',
      ' line2',
      '',
    ].join('\n')

    const result = parseUnifiedDiff(input)

    expect(result.files).toHaveLength(2)
    expect(result.additions).toBe(3)
    expect(result.deletions).toBe(1)
    expect(result.files[0].oldPath).toBe('foo.txt')
    expect(result.files[0].newPath).toBe('foo.txt')
    expect(result.files[0].hunks[0].oldStart).toBe(0)
    expect(result.files[0].hunks[0].newStart).toBe(1)
  })

  it('returns empty summary for blank input', () => {
    // Empty input should return an empty summary.
    const result = parseUnifiedDiff('')

    expect(result.files).toHaveLength(0)
    expect(result.additions).toBe(0)
    expect(result.deletions).toBe(0)
  })
})
