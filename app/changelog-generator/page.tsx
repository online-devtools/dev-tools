import type { Metadata } from 'next'
import ChangelogGeneratorTool from '@/components/ChangelogGeneratorTool'

export const metadata: Metadata = {
  title: 'Markdown Changelog Generator',
  description: 'Turn commit or PR lists into a structured changelog.',
  keywords: ['changelog', 'markdown', 'release notes'],
}

export default function ChangelogGeneratorPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <ChangelogGeneratorTool />
    </div>
  )
}
