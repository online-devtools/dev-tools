import type { Metadata } from 'next'
import SqlExplainTool from '@/components/SqlExplainTool'

export const metadata: Metadata = {
  title: 'SQL Explain Analyzer',
  description: 'Inspect EXPLAIN output for common bottlenecks and heavy scans.',
  keywords: ['sql explain', 'postgres', 'mysql', 'query plan'],
}

export default function SqlExplainPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <SqlExplainTool />
    </div>
  )
}
