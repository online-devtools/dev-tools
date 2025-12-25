import { Metadata } from 'next'
import CookieParserTool from '@/components/CookieParserTool'

export const metadata: Metadata = {
  // Metadata ensures the cookie parser is indexed and shareable.
  title: 'Cookie Parser - 쿠키 파서',
  description: 'HTTP Cookie 헤더를 JSON으로 파싱하거나 JSON을 Cookie 헤더로 변환합니다.',
  keywords: ['cookie parser', 'http cookie', 'header', 'json', '쿠키'],
}

export default function CookieParserPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the cookie parser tool within the shared layout container. */}
      <CookieParserTool />
    </div>
  )
}
