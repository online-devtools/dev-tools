import JSONCSVTool from '@/components/JSONCSVTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON to CSV Converter - JSON을 CSV로 변환',
  description: 'JSON 배열을 CSV 형식으로 변환합니다. 자동으로 헤더를 감지합니다.',
  keywords: ['json', 'csv', 'converter', '변환'],
}

export default function JSONCSVPage() {
  return <JSONCSVTool />
}
