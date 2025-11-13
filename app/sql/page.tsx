import SQLFormatter from '@/components/SQLFormatter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SQL 포맷터',
  description: 'SQL 쿼리를 포맷하고 최적화합니다. 무료 온라인 SQL 포맷터 및 정리 도구입니다.',
  keywords: ['SQL', 'SQL 포맷터', 'SQL formatter', 'SQL beautifier', 'SQL 정리', 'query formatter', 'SQL minify'],
  openGraph: {
    title: 'SQL 포맷터 - Developer Tools',
    description: 'SQL 쿼리를 포맷하고 최적화하는 무료 온라인 도구',
  },
}

export default function SQLPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <SQLFormatter />
    </div>
  )
}
