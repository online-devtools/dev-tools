import SemverTool from '@/components/SemverTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  // SemVer comparisons are common release tasks, so surface this page in search metadata.
  title: 'SemVer Comparator - 버전 비교기',
  description: 'Semantic Versioning(SemVer) 규칙에 따라 버전을 비교하고 목록을 정렬합니다.',
  keywords: ['semver', 'semantic version', 'version compare', '버전 비교'],
}

export default function SemverPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Use the shared container so tool cards align with the rest of the site. */}
      <SemverTool />
    </div>
  )
}
