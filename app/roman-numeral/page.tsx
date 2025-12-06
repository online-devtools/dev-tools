import RomanNumeralTool from '@/components/RomanNumeralTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Roman Numeral Converter - 로마 숫자 변환기',
  description: '아라비아 숫자를 로마 숫자로 변환하거나 로마 숫자를 아라비아 숫자로 변환합니다.',
  keywords: ['roman numeral', '로마 숫자', 'converter', 'I V X L C D M'],
}

export default function RomanNumeralPage() {
  return <RomanNumeralTool />
}
