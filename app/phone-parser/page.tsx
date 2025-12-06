import PhoneParserTool from '@/components/PhoneParserTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Phone Number Parser - 전화번호 파싱 및 포맷팅 도구',
  description: '전화번호를 파싱하고 검증하며 국제/국내 형식으로 포맷팅합니다. E.164, RFC3966 형식을 지원합니다.',
  keywords: ['phone parser', 'phone formatter', '전화번호 파싱', 'phone validation', 'E.164'],
}

export default function PhoneParserPage() {
  return <PhoneParserTool />
}
