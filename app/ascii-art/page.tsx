import ASCIIArtTool from '@/components/ASCIIArtTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ASCII Art Generator - ASCII 아트 생성기',
  description: '텍스트를 멋진 ASCII 아트로 변환합니다. 20가지 이상의 다양한 폰트 스타일을 지원합니다.',
  keywords: ['ASCII art', 'ASCII generator', 'text art', 'ASCII 아트', 'figlet'],
}

export default function ASCIIArtPage() {
  return <ASCIIArtTool />
}
