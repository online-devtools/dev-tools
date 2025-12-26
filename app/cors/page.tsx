import type { Metadata } from 'next'
import CorsTesterTool from '@/components/CorsTesterTool'

export const metadata: Metadata = {
  // Metadata keeps the CORS tester searchable.
  title: 'CORS Tester - CORS 헤더 확인',
  description: 'URL의 CORS 응답 헤더를 확인하고 차단 여부를 점검합니다.',
  keywords: ['cors', 'headers', 'http', 'tester'],
}

export default function CorsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the CORS tester inside the shared layout container. */}
      <CorsTesterTool />
    </div>
  )
}
