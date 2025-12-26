import type { Metadata } from 'next'
import EasingVisualizerTool from '@/components/EasingVisualizerTool'

export const metadata: Metadata = {
  // Highlight the cubic-bezier helper for CSS animation search queries.
  title: 'Animation Easing Visualizer',
  description: 'Tune cubic-bezier curves and preview animation easing in real time.',
  keywords: ['cubic-bezier', 'easing visualizer', 'animation timing function', 'css animation'],
}

export default function EasingVisualizerPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Keep the visualizer aligned with other tool layouts. */}
      <EasingVisualizerTool />
    </div>
  )
}
