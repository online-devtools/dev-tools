import URLParserTool from '@/components/URLParserTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'URL Parser - URL 분석 도구',
  description: 'URL을 구성 요소별로 분석합니다. Protocol, Host, Path, Query Parameters 등을 확인할 수 있습니다.',
  keywords: ['url parser', 'url analyzer', 'query params', 'url 분석'],
}

export default function URLParserPage() {
  return <URLParserTool />
}
