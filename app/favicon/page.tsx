import type { Metadata } from 'next'
import FaviconGeneratorTool from '@/components/FaviconGeneratorTool'

export const metadata: Metadata = {
  // Metadata keeps the favicon generator searchable.
  title: 'Favicon Generator - 파비콘 생성기',
  description: '이미지를 업로드해 다양한 크기의 favicon을 생성합니다.',
  keywords: ['favicon', 'icon', 'generator', 'png'],
}

export default function FaviconPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the favicon generator within the shared layout container. */}
      <FaviconGeneratorTool />
    </div>
  )
}
