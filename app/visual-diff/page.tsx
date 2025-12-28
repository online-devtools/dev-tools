import type { Metadata } from 'next'
import VisualDiffTool from '@/components/VisualDiffTool'

export const metadata: Metadata = {
  title: 'Visual Diff',
  description: 'Compare two screenshots and highlight pixel-level differences.',
  keywords: ['visual regression', 'screenshot diff', 'pixel compare'],
}

export default function VisualDiffPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <VisualDiffTool />
    </div>
  )
}
