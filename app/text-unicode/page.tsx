import TextUnicodeTool from '@/components/TextUnicodeTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Text to Unicode - 텍스트와 유니코드 변환',
  description: '텍스트를 유니코드 코드 포인트로 변환하거나 그 반대로 변환합니다.',
  keywords: ['unicode', '유니코드', 'code point', 'text converter'],
}

export default function TextUnicodePage() {
  return <TextUnicodeTool />
}
