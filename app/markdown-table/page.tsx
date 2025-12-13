import type { Metadata } from 'next'
import MarkdownTableTool from '@/components/MarkdownTableTool'

export const metadata: Metadata = {
  title: 'Markdown Table Generator - Create Tables Easily',
  description: 'Visual markdown table generator with alignment options. Create beautiful markdown tables for GitHub, documentation, and README files.',
  keywords: ['markdown table', 'table generator', 'markdown', 'github table', 'readme table', 'markdown editor'],
}

export default function MarkdownTablePage() {
  return <MarkdownTableTool />
}
