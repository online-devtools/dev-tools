import type { Metadata } from 'next'
import ApiResponseTimeTool from '@/components/ApiResponseTimeTool'

export const metadata: Metadata = {
  // Keep the response time chart page discoverable with targeted keywords.
  title: 'API Response Time Chart',
  description: 'Send repeat requests to an API endpoint and visualize response time trends with summary stats.',
  keywords: ['api response time', 'latency chart', 'performance testing', 'http timing'],
}

export default function ApiResponseTimePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the response time tool within the standard page container. */}
      <ApiResponseTimeTool />
    </div>
  )
}
