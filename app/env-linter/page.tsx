import type { Metadata } from 'next'
import EnvLinterTool from '@/components/EnvLinterTool'

// 페이지 메타데이터는 검색 결과와 공유 카드에 노출됩니다.
export const metadata: Metadata = {
  title: 'Env Linter - Validate .env Files Offline',
  description: 'Lint .env files locally for duplicates, missing values, and required keys without uploading data.',
  keywords: ['env', '.env', 'linter', 'configuration', 'offline'],
}

export default function EnvLinterPage() {
  // App Router 페이지는 도구 컴포넌트를 그대로 렌더링합니다.
  return <EnvLinterTool />
}
