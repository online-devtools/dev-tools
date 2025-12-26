import type { Metadata } from 'next'
import PdfMetadataTool from '@/components/PdfMetadataTool'

export const metadata: Metadata = {
  // Metadata keeps the PDF metadata viewer searchable.
  title: 'PDF Metadata Viewer - PDF 메타데이터',
  description: 'PDF 파일의 제목, 작성자, 생성 날짜 등 메타데이터를 확인합니다.',
  keywords: ['pdf metadata', 'pdf', 'viewer', 'document'],
}

export default function PdfMetadataPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the PDF metadata tool inside the shared layout container. */}
      <PdfMetadataTool />
    </div>
  )
}
