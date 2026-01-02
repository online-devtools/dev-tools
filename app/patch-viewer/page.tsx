import type { Metadata } from 'next'
import PatchViewerTool from '@/components/PatchViewerTool'

// Metadata is used for SEO and link previews.

export default function PatchViewerPage() {
  // Render the tool component directly in the App Router page.
  return <PatchViewerTool />
}
