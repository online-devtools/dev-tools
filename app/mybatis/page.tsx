import MyBatisConverter from '@/components/MyBatisConverter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MyBatis to SQL Converter',
  description: 'MyBatis 쿼리를 SQL 콘솔에서 바로 실행 가능한 형태로 변환합니다. #{} 파라미터를 실제 값으로 치환하여 디버깅을 쉽게 하세요.',
  keywords: ['MyBatis', 'SQL Converter', 'MyBatis to SQL', '쿼리 변환', 'SQL 디버깅', 'PreparedStatement'],
  openGraph: {
    title: 'MyBatis to SQL Converter - Developer Tools',
    description: 'MyBatis 쿼리를 SQL 콘솔 실행 가능한 형태로 변환',
  },
}

export default function MyBatisPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <MyBatisConverter />
    </div>
  )
}
