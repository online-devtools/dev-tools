import type { Metadata } from 'next'
import SchemaVisualizerTool from '@/components/SchemaVisualizerTool'

export const metadata: Metadata = {
  // Metadata makes the schema visualizer easier to discover for database users.
  title: 'Database Schema Visualizer',
  description: 'Paste SQL DDL and generate a quick ER diagram summary plus Mermaid output.',
  keywords: ['schema visualizer', 'erd', 'sql ddl', 'database diagram', 'mermaid erd'],
}

export default function SchemaVisualizerPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Keep the visualizer aligned with the standard tool width. */}
      <SchemaVisualizerTool />
    </div>
  )
}
