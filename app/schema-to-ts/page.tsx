import type { Metadata } from 'next'
import SchemaToTypesTool from '@/components/SchemaToTypesTool'

// Metadata is used for search and sharing previews.
export const metadata: Metadata = {
  title: 'Schema to TypeScript - JSON Schema Converter',
  description: 'Convert JSON Schema into TypeScript types locally without uploading data.',
  keywords: ['json schema', 'typescript', 'types', 'converter', 'offline'],
}

export default function SchemaToTypesPage() {
  // Render the tool component directly for the App Router page.
  return <SchemaToTypesTool />
}
