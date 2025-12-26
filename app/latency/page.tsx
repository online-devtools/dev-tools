import type { Metadata } from 'next'
import LatencyTesterTool from '@/components/LatencyTesterTool'

export const metadata: Metadata = {
  // Metadata keeps the latency tester discoverable.
  title: 'Latency Tester - 응답 시간 측정',
  description: 'HTTP 요청 기반으로 엔드포인트 응답 시간을 측정합니다.',
  keywords: ['latency', 'ping', 'http', 'tester'],
}

export default function LatencyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the latency tester inside the shared layout container. */}
      <LatencyTesterTool />
    </div>
  )
}
