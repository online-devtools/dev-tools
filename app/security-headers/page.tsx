import type { Metadata } from 'next'
import SecurityHeadersTool from '@/components/SecurityHeadersTool'

// Metadata is used for SEO and sharing previews.
export const metadata: Metadata = {
  title: 'Security Headers Analyzer - HTTP Response Checker',
  description: 'Analyze HTTP response headers for missing or weak security directives entirely in the browser.',
  keywords: ['security headers', 'http', 'csp', 'hsts', 'analyzer'],
}

export default function SecurityHeadersPage() {
  // Render the tool component directly for the App Router page.
  return <SecurityHeadersTool />
}
