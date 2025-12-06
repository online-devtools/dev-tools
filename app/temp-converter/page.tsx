import TempConverterTool from '@/components/TempConverterTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Temperature Converter - 온도 변환기',
  description: '섭씨, 화씨, 켈빈 등 다양한 온도 단위를 변환합니다.',
  keywords: ['temperature', 'celsius', 'fahrenheit', 'kelvin', '온도', '섭씨', '화씨'],
}

export default function TempConverterPage() {
  return <TempConverterTool />
}
