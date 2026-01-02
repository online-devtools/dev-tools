import type { Metadata } from 'next'
import PdfMetadataTool from '@/components/PdfMetadataTool'

export default function PdfMetadataPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the PDF metadata tool inside the shared layout container. */}
      <PdfMetadataTool />
    </div>
  )
}
