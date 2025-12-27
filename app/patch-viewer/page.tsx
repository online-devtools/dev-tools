import type { Metadata } from 'next'
import PatchViewerTool from '@/components/PatchViewerTool'

// Metadata is used for SEO and link previews.
export const metadata: Metadata = {
  title: 'Patch Viewer - Unified Diff Inspector',
  description: 'Inspect git diff/patch files in the browser with per-file summaries and line-level highlights.',
  keywords: ['diff', 'patch', 'git', 'viewer', 'unified diff'],
}

export default function PatchViewerPage() {
  // Render the tool component directly in the App Router page.
  return <PatchViewerTool />
}
