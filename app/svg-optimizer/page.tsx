import type { Metadata } from 'next'
import SVGOptimizerTool from '@/components/SVGOptimizerTool'

export const metadata: Metadata = {
  title: 'SVG Optimizer - Compress and Optimize SVG Files Online',
  description: 'Free online SVG optimizer. Remove metadata, comments, and unnecessary code. Reduce SVG file size while maintaining quality.',
  keywords: ['SVG optimizer', 'SVG compressor', 'optimize SVG', 'compress SVG', 'SVG minifier', 'reduce SVG size'],
}

export default function SVGOptimizerPage() {
  return <SVGOptimizerTool />
}
