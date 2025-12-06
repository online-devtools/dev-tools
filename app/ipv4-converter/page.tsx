import IPv4ConverterTool from '@/components/IPv4ConverterTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IPv4 Address Converter - IP 주소 변환 도구',
  description: 'IPv4 주소를 십진수, 이진수, 16진수, 8진수 형식으로 변환합니다. IP 클래스 정보도 확인할 수 있습니다.',
  keywords: ['IPv4 converter', 'IP address', 'IP 변환', 'decimal to IP', 'IP class'],
}

export default function IPv4ConverterPage() {
  return <IPv4ConverterTool />
}
