import type { Metadata } from 'next'
import FileHashTool from '@/components/FileHashTool'

export const metadata: Metadata = {
  // Metadata ensures the file hash tool is indexed.
  title: 'File Hash Calculator - 파일 해시 계산기',
  description: '대용량 파일의 SHA 해시를 계산합니다.',
  keywords: ['file hash', 'sha256', 'checksum', 'integrity'],
}

export default function FileHashPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the file hash tool inside the shared layout container. */}
      <FileHashTool />
    </div>
  )
}
