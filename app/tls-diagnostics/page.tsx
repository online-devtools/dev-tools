import type { Metadata } from 'next'
import TlsDiagnosticsTool from '@/components/TlsDiagnosticsTool'

export const metadata: Metadata = {
  title: 'TLS Diagnostics',
  description: 'Parse TLS handshake outputs and summarize protocol, cipher, ALPN, and OCSP details.',
  keywords: ['tls', 'openssl', 'handshake', 'alpn', 'ocsp'],
}

export default function TlsDiagnosticsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <TlsDiagnosticsTool />
    </div>
  )
}
