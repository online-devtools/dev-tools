import DiffContent from './DiffContent'
import { Metadata } from 'next'

export const metadata: Metadata = {
  // 메타데이터는 서버 컴포넌트에서만 허용되므로 정적 영어 본문으로 유지합니다.
  title: 'Diff Checker - Text comparison',
  description: 'Compare two texts and highlight changes with this free online diff tool.',
  keywords: ['diff', 'diff checker', '텍스트 비교', 'text compare', 'text difference', 'compare text', 'text diff'],
  openGraph: {
    title: 'Diff Checker - Developer Tools',
    description: 'Free online tool to compare two texts',
  },
}

export default function DiffPage() {
  return <DiffContent />
}
