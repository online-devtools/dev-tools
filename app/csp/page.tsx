import type { Metadata } from 'next'
import CspBuilderTool from '@/components/CspBuilderTool'

export const metadata: Metadata = {
  // Metadata keeps the CSP builder discoverable by search engines.
  title: 'CSP Header Builder - Content Security Policy',
  description: 'Build Content Security Policy headers with common directives and safe defaults.',
  keywords: ['csp', 'content security policy', 'security header', 'builder'],
}

export default function CspBuilderPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the CSP builder inside the shared layout width. */}
      <CspBuilderTool />
    </div>
  )
}
