import MIMETypesTool from '@/components/MIMETypesTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MIME Types - MIME 타입과 파일 확장자 변환',
  description: 'MIME 타입을 파일 확장자로 변환하거나 그 반대로 변환합니다.',
  keywords: ['mime type', 'content type', 'file extension', '파일 확장자'],
}

export default function MIMETypesPage() {
  return <MIMETypesTool />
}
