import MIMETypesTool from '@/components/MIMETypesTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  // 정적 메타데이터는 요청 시점에 번역 훅을 사용할 수 없으므로, 영어 기반 설명으로 노출합니다.
  title: 'MIME Types - Convert MIME types and file extensions',
  description: 'Convert MIME types to file extensions or the other way around.',
  keywords: ['mime type', 'content type', 'file extension', '파일 확장자'],
}

export default function MIMETypesPage() {
  return <MIMETypesTool />
}
