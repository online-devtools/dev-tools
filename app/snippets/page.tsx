import { Metadata } from 'next'
import SnippetsContent from './SnippetsContent'

export const metadata: Metadata = {
  title: '코드 스니펫',
  description: 'Base64, JWT, CSV 변환, 정규식 검사 등 자주 쓰는 작업을 바로 복붙할 수 있는 예제 모음.',
  openGraph: {
    title: '코드 스니펫',
    description: '도구별 실무 코드 예제로 사이트 가치를 높이세요.',
  },
}

export default function SnippetsPage() {
  return <SnippetsContent />
}
