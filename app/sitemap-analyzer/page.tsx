import type { Metadata } from 'next'
import SitemapAnalyzerTool from '@/components/SitemapAnalyzerTool'

// Metadata supports SEO previews for the sitemap analyzer tool page.
export const metadata: Metadata = {
  title: 'Sitemap Analyzer - XML Insight',
  description: 'Analyze sitemap XML for duplicates, missing lastmod values, and entry summaries.',
  keywords: ['sitemap', 'xml', 'seo', 'analyzer', 'lastmod'],
}

export default function SitemapAnalyzerPage() {
  // Render the sitemap analyzer UI for the App Router route.
  return <SitemapAnalyzerTool />
}
