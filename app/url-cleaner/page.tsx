import type { Metadata } from 'next'
import UrlCleanerTool from '@/components/UrlCleanerTool'

// Metadata is used for SEO and sharing previews.
export const metadata: Metadata = {
  title: 'URL Cleaner - Remove Tracking Params',
  description: 'Clean URLs by removing tracking parameters and sorting query strings locally.',
  keywords: ['url cleaner', 'utm', 'tracking', 'query', 'normalize'],
}

export default function UrlCleanerPage() {
  // Render the tool component directly for the App Router page.
  return <UrlCleanerTool />
}
