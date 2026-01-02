import type { Metadata } from 'next'
import LogRedactorTool from '@/components/LogRedactorTool'

// Metadata is used for SEO and sharing previews.

export default function LogRedactorPage() {
  // Render the tool component directly for the App Router page.
  return <LogRedactorTool />
}
