import type { Metadata } from 'next'
import BoxShadowTool from '@/components/BoxShadowTool'

export const metadata: Metadata = {
  title: 'Box Shadow Generator - Create CSS Box Shadows',
  description: 'Visual box shadow generator with live preview. Create beautiful CSS box shadows with multiple layers, inset shadows, and export code with vendor prefixes.',
  keywords: ['box shadow', 'css shadow', 'shadow generator', 'css', 'web design', 'drop shadow'],
}

export default function BoxShadowPage() {
  return <BoxShadowTool />
}
