import type { Metadata } from 'next'
import SecurityHeadersTool from '@/components/SecurityHeadersTool'

// Metadata is used for SEO and sharing previews.

export default function SecurityHeadersPage() {
  // Render the tool component directly for the App Router page.
  return <SecurityHeadersTool />
}
