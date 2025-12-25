import HTTPHeadersTool from '@/components/HTTPHeadersTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  // Keep metadata explicit so the headers tool is discoverable via search.
  title: 'HTTP Headers Converter - 헤더 변환기',
  description: 'HTTP 헤더 블록과 JSON 객체를 상호 변환합니다. API 디버깅과 문서화에 유용합니다.',
  keywords: ['http headers', 'header parser', 'json converter', '헤더 변환'],
}

export default function HTTPHeadersPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Standard width container keeps tool pages visually consistent. */}
      <HTTPHeadersTool />
    </div>
  )
}
