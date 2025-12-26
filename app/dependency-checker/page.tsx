import type { Metadata } from 'next'
import DependencyCheckerTool from '@/components/DependencyCheckerTool'

export const metadata: Metadata = {
  // Metadata supports search indexing for dependency checking.
  title: 'Dependency Version Checker - 패키지 최신 버전 확인',
  description: 'package.json 의존성을 최신 버전과 비교합니다.',
  keywords: ['dependency checker', 'package.json', 'npm', 'version'],
}

export default function DependencyCheckerPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the dependency checker inside the shared layout container. */}
      <DependencyCheckerTool />
    </div>
  )
}
