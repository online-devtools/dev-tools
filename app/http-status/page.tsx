import HTTPStatusTool from '@/components/HTTPStatusTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTTP Status Codes - HTTP 상태 코드 목록',
  description: '모든 HTTP 상태 코드와 그 의미를 확인합니다. 100번대부터 500번대까지 전체 목록을 제공합니다.',
  keywords: ['http', 'status code', '상태 코드', '200', '404', '500'],
}

export default function HTTPStatusPage() {
  return <HTTPStatusTool />
}
