import type { Metadata } from 'next'
import MetaTagsTool from '@/components/MetaTagsTool'

export const metadata: Metadata = {
  title: 'Meta Tags Generator - SEO & Social Media Tags',
  description: 'Generate meta tags for SEO, Open Graph (Facebook), and Twitter Cards. Preview how your page will appear when shared on social media.',
  keywords: ['meta tags', 'seo', 'open graph', 'twitter card', 'social media', 'og tags', 'meta generator'],
}

export default function MetaTagsPage() {
  return <MetaTagsTool />
}
