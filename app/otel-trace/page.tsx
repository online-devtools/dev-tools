import type { Metadata } from 'next'
import OtelTraceTool from '@/components/OtelTraceTool'

export const metadata: Metadata = {
  title: 'OpenTelemetry Trace Viewer',
  description: 'Inspect OTLP, Jaeger, or Zipkin JSON traces and surface slow spans quickly.',
  keywords: ['opentelemetry', 'otel', 'trace viewer', 'jaeger', 'zipkin'],
}

export default function OtelTracePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <OtelTraceTool />
    </div>
  )
}
