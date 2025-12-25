import { Metadata } from 'next'
import EnvDiffTool from '@/components/EnvDiffTool'

export const metadata: Metadata = {
  // Metadata improves indexing for the .env diff tool page.
  title: '.env Diff - 환경 변수 비교',
  description: '.env 파일 두 개를 비교하여 추가/삭제/변경된 값을 빠르게 확인합니다.',
  keywords: ['env diff', 'dotenv', 'environment variables', 'compare', '환경 변수'],
}

export default function EnvDiffPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the env diff tool inside the common layout width. */}
      <EnvDiffTool />
    </div>
  )
}
