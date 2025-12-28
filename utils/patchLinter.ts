import { parseUnifiedDiff, PatchLine } from '@/utils/patchParser'

export type PatchLintSummary = {
  trailingWhitespace: number
  missingNewlineMarkers: number
  largePatch: number
}

export type PatchLintIssueType = 'trailingWhitespace' | 'missingNewline' | 'largePatch'

export type PatchLintIssue = {
  type: PatchLintIssueType
  file: string
  line?: string
  message: string
}

export type PatchLinterOptions = {
  largePatchThreshold?: number
}

export type PatchLintResult = {
  summary: PatchLintSummary
  issues: PatchLintIssue[]
}

const DEFAULT_LARGE_PATCH_THRESHOLD = 200

const formatLineRef = (line: PatchLine): string => {
  // Prefer the new line number when present to match diff reviews.
  if (line.newLine !== null) return `new:${line.newLine}`
  if (line.oldLine !== null) return `old:${line.oldLine}`
  return 'n/a'
}

const hasTrailingWhitespace = (content: string): boolean => {
  // Check for whitespace at the end of the line, excluding the diff prefix.
  return /[ \t]$/.test(content)
}

export const lintPatch = (input: string, options: PatchLinterOptions = {}): PatchLintResult => {
  const { largePatchThreshold = DEFAULT_LARGE_PATCH_THRESHOLD } = options
  const parsed = parseUnifiedDiff(input)

  const summary: PatchLintSummary = {
    trailingWhitespace: 0,
    missingNewlineMarkers: 0,
    largePatch: 0,
  }
  const issues: PatchLintIssue[] = []

  parsed.files.forEach((file) => {
    // Count large patches per file to highlight oversized diffs.
    if (file.additions + file.deletions > largePatchThreshold) {
      summary.largePatch += 1
      issues.push({
        type: 'largePatch',
        file: file.newPath || file.oldPath,
        message: `Large patch: ${file.additions + file.deletions} lines changed.`,
      })
    }

    file.hunks.forEach((hunk) => {
      hunk.lines.forEach((line) => {
        if (line.type === 'meta' && line.content.includes('No newline at end of file')) {
          summary.missingNewlineMarkers += 1
          issues.push({
            type: 'missingNewline',
            file: file.newPath || file.oldPath,
            line: formatLineRef(line),
            message: 'Missing newline at end of file.',
          })
          return
        }

        if (line.type !== 'meta' && hasTrailingWhitespace(line.content)) {
          summary.trailingWhitespace += 1
          issues.push({
            type: 'trailingWhitespace',
            file: file.newPath || file.oldPath,
            line: formatLineRef(line),
            message: 'Trailing whitespace detected.',
          })
        }
      })
    })
  })

  return { summary, issues }
}
