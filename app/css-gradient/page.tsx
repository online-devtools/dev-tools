import type { Metadata } from 'next'
import CSSGradientTool from '@/components/CSSGradientTool'

export const metadata: Metadata = {
  title: 'CSS Gradient Generator - Create Beautiful Gradients',
  description: 'Visual CSS gradient generator with live preview. Create linear, radial, and conic gradients with custom colors and export CSS code with vendor prefixes.',
  keywords: ['css gradient', 'gradient generator', 'linear gradient', 'radial gradient', 'conic gradient', 'css', 'web design'],
}

export default function CSSGradientPage() {
  return <CSSGradientTool />
}
