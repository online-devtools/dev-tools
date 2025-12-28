import type { Metadata } from 'next'
import DnsCompareTool from '@/components/DnsCompareTool'

// Metadata defines search snippet text for DNS compare tool page.
export const metadata: Metadata = {
  title: 'DNS Compare - Record Diff',
  description: 'Compare two sets of DNS records locally and highlight differences.',
  keywords: ['dns', 'records', 'compare', 'diff', 'a record', 'mx', 'cname'],
}

export default function DnsComparePage() {
  // Render the DNS comparison tool for this route.
  return <DnsCompareTool />
}
