import type { Metadata } from 'next'
import SitemapAnalyzerTool from '@/components/SitemapAnalyzerTool'

// Metadata supports SEO previews for the sitemap analyzer tool page.

export default function SitemapAnalyzerPage() {
  // Render the sitemap analyzer UI for the App Router route.
  return <SitemapAnalyzerTool />
}
