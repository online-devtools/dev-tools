import type { Metadata } from 'next'
import SQLBuilderTool from '@/components/SQLBuilderTool'

export const metadata: Metadata = {
  title: 'SQL Query Builder - Visual SQL Generator',
  description: 'Build SQL SELECT queries visually without writing code. Add columns, WHERE conditions, ORDER BY, and LIMIT clauses with an intuitive interface.',
  keywords: ['sql', 'sql builder', 'query builder', 'sql generator', 'database', 'select query', 'sql tool'],
}

export default function SQLBuilderPage() {
  return <SQLBuilderTool />
}
