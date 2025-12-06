import HMACTool from '@/components/HMACTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HMAC Generator - 메시지 인증 코드 생성',
  description: '비밀 키를 사용하여 HMAC (Hash-based Message Authentication Code)를 생성합니다. API 서명, 데이터 무결성 검증에 사용됩니다.',
  keywords: ['hmac', 'message authentication', 'api signature', '메시지 인증', '해시'],
}

export default function HMACPage() {
  return <HMACTool />
}
