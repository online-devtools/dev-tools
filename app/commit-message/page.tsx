import type { Metadata } from 'next'
import CommitMessageTool from '@/components/CommitMessageTool'

export const metadata: Metadata = {
  // Metadata keeps the commit message builder discoverable.
  title: 'Git Commit Message Template - Conventional Commits',
  description: 'Generate consistent Git commit messages with Conventional Commits and gitmoji.',
  keywords: ['git commit', 'conventional commits', 'gitmoji', 'template'],
}

export default function CommitMessagePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the commit message builder inside the shared layout container. */}
      <CommitMessageTool />
    </div>
  )
}
