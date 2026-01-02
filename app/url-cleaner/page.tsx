import type { Metadata } from 'next'
import UrlCleanerTool from '@/components/UrlCleanerTool'

// Metadata is used for SEO and sharing previews.

export default function UrlCleanerPage() {
  // Render the tool component directly for the App Router page.
  return <UrlCleanerTool />
}
