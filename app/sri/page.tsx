import type { Metadata } from 'next'
import SriGeneratorTool from '@/components/SriGeneratorTool'

export const metadata: Metadata = {
  // Metadata keeps the SRI generator indexable for security searches.
  title: 'Subresource Integrity Generator - SRI Hash',
  description: 'Generate SRI hashes (sha256/384/512) for scripts and styles.',
  keywords: ['sri', 'subresource integrity', 'hash', 'security'],
}

export default function SriGeneratorPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the SRI generator within the shared layout container. */}
      <SriGeneratorTool />
    </div>
  )
}
