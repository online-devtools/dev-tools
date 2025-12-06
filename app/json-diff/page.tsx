import JSONDiffTool from '@/components/JSONDiffTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Diff - JSON 비교',
  description: '두 JSON 객체를 비교하여 차이점을 확인합니다.',
  keywords: ['json', 'diff', 'compare', '비교', '차이'],
}

export default function JSONDiffPage() {
  return <JSONDiffTool />
}
