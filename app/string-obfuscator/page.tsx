import StringObfuscatorTool from '@/components/StringObfuscatorTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'String Obfuscator - 문자열 마스킹/난독화',
  description: '민감한 정보를 부분적으로 숨겨 공유 가능하게 만듭니다. IBAN, 토큰, API 키 등을 안전하게 표시할 수 있습니다.',
  keywords: ['obfuscator', 'mask', '마스킹', '난독화', 'privacy'],
}

export default function StringObfuscatorPage() {
  return <StringObfuscatorTool />
}
