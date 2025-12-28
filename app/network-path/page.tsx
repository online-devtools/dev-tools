import type { Metadata } from 'next'
import NetworkPathTool from '@/components/NetworkPathTool'

export const metadata: Metadata = {
  title: 'Network Path Analyzer',
  description: 'Check DNS across resolvers and analyze traceroute or MTR output.',
  keywords: ['dns', 'traceroute', 'mtr', 'network path'],
}

export default function NetworkPathPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <NetworkPathTool />
    </div>
  )
}
