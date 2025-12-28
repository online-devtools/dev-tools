import type { Metadata } from 'next'
import CertChainInspectorTool from '@/components/CertChainInspectorTool'

// Metadata provides descriptive search text for the certificate chain inspector.
export const metadata: Metadata = {
  title: 'Certificate Chain Inspector - Fingerprint Viewer',
  description: 'Inspect PEM certificate chains, generate SHA-256 fingerprints, and spot duplicates.',
  keywords: ['certificate', 'chain', 'pem', 'fingerprint', 'sha256'],
}

export default function CertChainPage() {
  // Render the certificate chain inspector tool page.
  return <CertChainInspectorTool />
}
