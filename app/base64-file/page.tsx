import Base64FileTool from '@/components/Base64FileTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Base64 File Converter - 파일을 Base64로 변환',
  description: '파일을 Base64 문자열로 변환하거나 Base64를 파일로 변환합니다.',
  keywords: ['base64', 'file converter', '파일 변환', 'image to base64'],
}

export default function Base64FilePage() {
  return <Base64FileTool />
}
