// Utilities to parse unified diff text into structured data for UI rendering.

export type PatchLineType = 'context' | 'add' | 'del' | 'meta'

export type PatchLine = {
  type: PatchLineType
  content: string
  oldLine: number | null
  newLine: number | null
}

export type PatchHunk = {
  header: string
  oldStart: number
  oldLines: number
  newStart: number
  newLines: number
  lines: PatchLine[]
  additions: number
  deletions: number
}

export type PatchFile = {
  oldPath: string
  newPath: string
  hunks: PatchHunk[]
  additions: number
  deletions: number
}

export type PatchParseResult = {
  files: PatchFile[]
  additions: number
  deletions: number
  warnings: string[]
}

const DIFF_HEADER_REGEX = /^diff --git a\/(.+) b\/(.+)$/
const HUNK_HEADER_REGEX = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/

const normalizePath = (path: string): string => {
  // Strip a/ and b/ prefixes to keep path display tidy.
  if (path === '/dev/null') return path
  return path.replace(/^a\//, '').replace(/^b\//, '')
}

const createEmptyFile = (oldPath: string, newPath: string): PatchFile => ({
  oldPath,
  newPath,
  hunks: [],
  additions: 0,
  deletions: 0,
})

export const parseUnifiedDiff = (input: string): PatchParseResult => {
  // Return an empty summary for blank input to keep the UI stable.
  if (!input.trim()) {
    return { files: [], additions: 0, deletions: 0, warnings: [] }
  }

  const lines = input.replace(/\r\n/g, '\n').split('\n')
  const files: PatchFile[] = []
  const warnings: string[] = []

  let currentFile: PatchFile | null = null
  let currentHunk: PatchHunk | null = null
  let oldLine = 0
  let newLine = 0

  const pushCurrentFile = () => {
    // Capture the previous file block before starting a new one.
    if (currentFile) {
      files.push(currentFile)
    }
  }

  for (const rawLine of lines) {
    // diff --git marks the start of a file block.
    const diffMatch = rawLine.match(DIFF_HEADER_REGEX)
    if (diffMatch) {
      pushCurrentFile()
      currentFile = createEmptyFile(normalizePath(diffMatch[1]), normalizePath(diffMatch[2]))
      currentHunk = null
      continue
    }

    // Update file paths based on --- / +++ lines.
    if (rawLine.startsWith('--- ')) {
      const path = normalizePath(rawLine.slice(4).trim())
      if (currentFile) {
        currentFile.oldPath = path
      }
      continue
    }

    if (rawLine.startsWith('+++ ')) {
      const path = normalizePath(rawLine.slice(4).trim())
      if (currentFile) {
        currentFile.newPath = path
      }
      continue
    }

    // Hunk headers provide old/new line ranges.
    const hunkMatch = rawLine.match(HUNK_HEADER_REGEX)
    if (hunkMatch) {
      if (!currentFile) {
        // If a hunk appears without a file header, create a placeholder file.
        warnings.push('Detected hunk without a preceding diff header.')
        currentFile = createEmptyFile('unknown', 'unknown')
      }
      const oldStart = Number(hunkMatch[1])
      const oldLines = Number(hunkMatch[2] ?? '1')
      const newStart = Number(hunkMatch[3])
      const newLines = Number(hunkMatch[4] ?? '1')

      currentHunk = {
        header: rawLine,
        oldStart,
        oldLines,
        newStart,
        newLines,
        lines: [],
        additions: 0,
        deletions: 0,
      }
      currentFile.hunks.push(currentHunk)
      // Start line counters at the hunk range offsets.
      oldLine = oldStart
      newLine = newStart
      continue
    }

    // Only parse line-level entries when we are inside a hunk.
    if (!currentHunk || !currentFile) {
      continue
    }

    if (rawLine.startsWith('\\ No newline at end of file')) {
      // Keep "no newline" markers without line numbers.
      currentHunk.lines.push({
        type: 'meta',
        content: rawLine,
        oldLine: null,
        newLine: null,
      })
      continue
    }

    if (rawLine.startsWith('+') && !rawLine.startsWith('+++')) {
      currentHunk.lines.push({
        type: 'add',
        content: rawLine,
        oldLine: null,
        newLine,
      })
      currentHunk.additions += 1
      currentFile.additions += 1
      newLine += 1
      continue
    }

    if (rawLine.startsWith('-') && !rawLine.startsWith('---')) {
      currentHunk.lines.push({
        type: 'del',
        content: rawLine,
        oldLine,
        newLine: null,
      })
      currentHunk.deletions += 1
      currentFile.deletions += 1
      oldLine += 1
      continue
    }

    if (rawLine.startsWith(' ')) {
      currentHunk.lines.push({
        type: 'context',
        content: rawLine,
        oldLine,
        newLine,
      })
      oldLine += 1
      newLine += 1
    }
  }

  // Push the last file block if present.
  pushCurrentFile()

  const additions = files.reduce((sum, file) => sum + file.additions, 0)
  const deletions = files.reduce((sum, file) => sum + file.deletions, 0)

  return { files, additions, deletions, warnings }
}
