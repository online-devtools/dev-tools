import EmailNormalizerTool from '@/components/EmailNormalizerTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Email Normalizer - 이메일 정규화',
  description: '이메일 주소를 표준 형식으로 정규화하여 중복을 제거하고 데이터를 정리합니다.',
  keywords: ['email', 'normalizer', '이메일 정규화', 'email validation'],
}

export default function EmailNormalizerPage() {
  return <EmailNormalizerTool />
}
