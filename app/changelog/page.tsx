import { Metadata } from 'next'
import ChangelogContent from './ChangelogContent'

export const metadata: Metadata = {
  title: '업데이트 로그',
  description: '새 도구 추가, 코드 스니펫, 정책 업데이트 등 최근 변경 내역을 확인하세요.',
  openGraph: {
    title: '업데이트 로그',
    description: '최근 추가된 기능과 개선 사항 기록',
  },
}

export default function ChangelogPage() {
  return <ChangelogContent />
}
