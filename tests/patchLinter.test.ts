import { describe, expect, it } from 'vitest'
import { lintPatch } from '@/utils/patchLinter'

// Patch linter should flag whitespace and newline issues.
describe('patchLinter utils', () => {
  it('detects trailing whitespace and missing newline markers', () => {
    const diff = [
      'diff --git a/foo.txt b/foo.txt',
      '--- a/foo.txt',
      '+++ b/foo.txt',
      '@@ -1,2 +1,2 @@',
      '-hello',
      '+hello ',
      '\\ No newline at end of file',
    ].join('\n')

    const result = lintPatch(diff)

    expect(result.summary.trailingWhitespace).toBe(1)
    expect(result.summary.missingNewlineMarkers).toBe(1)
  })

  it('flags large patches when thresholds are exceeded', () => {
    const diff = [
      'diff --git a/foo.txt b/foo.txt',
      '--- a/foo.txt',
      '+++ b/foo.txt',
      '@@ -1,1 +1,3 @@',
      '-old',
      '+new1',
      '+new2',
      '+new3',
    ].join('\n')

    const result = lintPatch(diff, { largePatchThreshold: 2 })

    expect(result.summary.largePatch).toBe(1)
  })
})
