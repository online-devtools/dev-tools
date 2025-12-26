import type { Metadata } from 'next'
import LayoutPlaygroundTool from '@/components/LayoutPlaygroundTool'

export const metadata: Metadata = {
  // Describe the playground so it appears for flexbox/grid layout searches.
  title: 'CSS Layout Playground',
  description: 'Experiment with flexbox and grid settings and copy the generated CSS.',
  keywords: ['flexbox playground', 'css grid playground', 'layout tester', 'css layout'],
}

export default function LayoutPlaygroundPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Keep the playground layout consistent with other tool pages. */}
      <LayoutPlaygroundTool />
    </div>
  )
}
