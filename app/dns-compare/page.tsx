import type { Metadata } from 'next'
import DnsCompareTool from '@/components/DnsCompareTool'

// Metadata defines search snippet text for DNS compare tool page.

export default function DnsComparePage() {
  // Render the DNS comparison tool for this route.
  return <DnsCompareTool />
}
