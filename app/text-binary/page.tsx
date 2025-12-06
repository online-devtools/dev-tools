import TextBinaryTool from '@/components/TextBinaryTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Text to ASCII Binary - 텍스트와 이진수 변환',
  description: '텍스트를 ASCII 이진수로 변환하거나 이진수를 텍스트로 변환합니다.',
  keywords: ['binary', 'ascii', '이진수', '바이너리', 'text converter'],
}

export default function TextBinaryPage() {
  return <TextBinaryTool />
}
