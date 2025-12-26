import { describe, expect, it } from 'vitest'
import { buildCommitMessage } from '@/utils/commitMessage'

// Commit message building should follow Conventional Commits formatting rules.
describe('commitMessage utils', () => {
  it('builds a conventional commit message with body and footer', () => {
    // Provide all fields to validate formatting, breaking changes, and references.
    const message = buildCommitMessage({
      type: 'feat',
      scope: 'auth',
      subject: 'add login',
      body: 'Add login form and validation.',
      breakingDescription: 'Token format changed.',
      issueReferences: ['#123'],
      gitmoji: ':sparkles:',
    })

    expect(message).toBe(
      [
        ':sparkles: feat(auth)!: add login',
        '',
        'Add login form and validation.',
        '',
        'BREAKING CHANGE: Token format changed.',
        'Refs #123',
      ].join('\n')
    )
  })
})
