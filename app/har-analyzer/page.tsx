import type { Metadata } from 'next'
import HarAnalyzerTool from '@/components/HarAnalyzerTool'

// 메타데이터는 검색 결과와 공유 카드에서 표시될 정보를 제공합니다.
export const metadata: Metadata = {
  title: 'HAR Analyzer - Inspect Network Logs Offline',
  description: 'Analyze HAR files in your browser. Summaries, size breakdowns, and slow request insights without any server upload.',
  keywords: ['har', 'har analyzer', 'network log', 'performance', 'request timing', 'offline'],
}

export default function HarAnalyzerPage() {
  // App Router 페이지는 도구 컴포넌트를 그대로 렌더링합니다.
  return <HarAnalyzerTool />
}
