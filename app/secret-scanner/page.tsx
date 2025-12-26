import type { Metadata } from 'next'
import SecretScannerTool from '@/components/SecretScannerTool'

// 시크릿 스캐너 페이지 메타데이터로 검색 엔진/공유 카드 정보를 제공합니다.
export const metadata: Metadata = {
  title: 'Secret Scanner - Find Exposed Tokens Offline',
  description: 'Scan text files for common API keys and tokens locally in your browser. No uploads, no server processing.',
  keywords: ['secret scanner', 'api key', 'token detection', 'security', 'offline'],
}

export default function SecretScannerPage() {
  // 도구 UI 컴포넌트를 바로 렌더링합니다.
  return <SecretScannerTool />
}
