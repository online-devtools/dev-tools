import TokenGeneratorTool from '@/components/TokenGeneratorTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Token Generator - 랜덤 문자열 생성기',
  description: '원하는 문자 조합으로 랜덤 토큰과 문자열을 생성합니다. 대문자, 소문자, 숫자, 특수문자를 선택하여 안전한 토큰을 만들 수 있습니다.',
  keywords: ['token generator', 'random string', '토큰 생성', '랜덤 문자열', 'password generator'],
}

export default function TokenGeneratorPage() {
  return <TokenGeneratorTool />
}
