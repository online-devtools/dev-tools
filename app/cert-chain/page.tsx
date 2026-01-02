import type { Metadata } from 'next'
import CertChainInspectorTool from '@/components/CertChainInspectorTool'

// Metadata provides descriptive search text for the certificate chain inspector.

export default function CertChainPage() {
  // Render the certificate chain inspector tool page.
  return <CertChainInspectorTool />
}
