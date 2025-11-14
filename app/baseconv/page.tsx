import BaseConverterTool from '@/components/BaseConverterTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Base Converter (진법 변환기) | Developer Tools',
  description: '2진수, 8진수, 10진수, 16진수 변환 도구. Binary, Octal, Decimal, Hexadecimal converter',
  keywords: ['base converter', 'binary converter', 'hex converter', '진법 변환', '2진수', '16진수', 'hexadecimal'],
}

export default function BaseConvPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <BaseConverterTool />
    </div>
  )
}
