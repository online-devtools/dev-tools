import type { Metadata } from 'next'
import ColorPaletteTool from '@/components/ColorPaletteTool'

export const metadata: Metadata = {
  // Metadata keeps the color palette tool searchable.
  title: 'Color Palette Generator - 색상 팔레트',
  description: '이미지에서 주요 색상을 추출해 팔레트를 생성합니다.',
  keywords: ['color palette', 'image colors', 'palette', 'design'],
}

export default function ColorPalettePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the color palette tool inside the shared layout container. */}
      <ColorPaletteTool />
    </div>
  )
}
