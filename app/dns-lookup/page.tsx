import type { Metadata } from 'next'
import DnsLookupTool from '@/components/DnsLookupTool'

export const metadata: Metadata = {
    title: 'DNS Lookup - Query DNS Records Online',
    description: 'Lookup DNS records for any domain. Query A, AAAA, MX, TXT, NS, CNAME, and more. Uses Google and Cloudflare DNS-over-HTTPS.',
    keywords: ['dns', 'dns lookup', 'domain', 'mx record', 'a record', 'txt record', 'nameserver', 'dns query'],
}

export default function DnsLookupPage() {
    return <DnsLookupTool />
}
