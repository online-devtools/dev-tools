import type { Metadata } from 'next'
import LogInspectorTool from '@/components/LogInspectorTool'

// 메타데이터는 로그 분석 도구의 용도를 검색 결과에 설명합니다.
export const metadata: Metadata = {
  title: 'Log Inspector - Filter and Analyze Logs Offline',
  description: 'Analyze log text locally with level filters, keyword search, and time ranges without server uploads.',
  keywords: ['log', 'log inspector', 'log filter', 'debugging', 'offline'],
}

export default function LogInspectorPage() {
  // App Router 페이지는 도구 컴포넌트를 그대로 렌더링합니다.
  return <LogInspectorTool />
}
