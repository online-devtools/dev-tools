// Conventional Commit message builder for consistent Git histories.
// This utility focuses on formatting rather than suggesting content.

export type CommitMessageOptions = {
  type: string
  scope?: string
  subject: string
  body?: string
  breakingDescription?: string
  issueReferences?: string[]
  gitmoji?: string
}

export const buildCommitMessage = (options: CommitMessageOptions): string => {
  const scopeSegment = options.scope ? `(${options.scope})` : ''
  const breakingMarker = options.breakingDescription ? '!' : ''
  const gitmojiPrefix = options.gitmoji ? `${options.gitmoji} ` : ''

  // Header is the first line of the commit message.
  const header = `${gitmojiPrefix}${options.type}${scopeSegment}${breakingMarker}: ${options.subject}`.trim()

  const sections: string[] = [header]

  if (options.body) {
    // Separate header and body with a blank line for Conventional Commits.
    sections.push('', options.body)
  }

  const footerLines: string[] = []
  if (options.breakingDescription) {
    footerLines.push(`BREAKING CHANGE: ${options.breakingDescription}`)
  }

  if (options.issueReferences && options.issueReferences.length > 0) {
    footerLines.push(`Refs ${options.issueReferences.join(', ')}`)
  }

  if (footerLines.length > 0) {
    sections.push('', ...footerLines)
  }

  return sections.join('\n')
}
