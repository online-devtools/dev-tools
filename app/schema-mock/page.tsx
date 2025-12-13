import SchemaMockTool from '@/components/SchemaMockTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Schema Mock/Types',
  description: 'Generate mock JSON and TypeScript types from JSON Schema.',
}

export default function SchemaMockPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <SchemaMockTool />
    </div>
  )
}
