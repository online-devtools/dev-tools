import CSVConverter from '@/components/CSVConverter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CSV/JSON 변환기',
  description: 'CSV와 JSON 형식을 상호 변환합니다. 무료 온라인 CSV to JSON, JSON to CSV 변환 도구입니다.',
  keywords: ['CSV', 'JSON', 'CSV to JSON', 'JSON to CSV', 'CSV converter', 'JSON converter', '데이터 변환'],
  openGraph: {
    title: 'CSV/JSON 변환기 - Developer Tools',
    description: 'CSV와 JSON 형식을 상호 변환하는 무료 온라인 도구',
  },
}

export default function CSVPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <CSVConverter />
    </div>
  )
}
