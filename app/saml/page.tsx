import type { Metadata } from 'next'
import SamlDebuggerTool from '@/components/SamlDebuggerTool'

export const metadata: Metadata = {
  // Metadata keeps the SAML debugger discoverable.
  title: 'SAML Debugger - SAML Request/Response Decoder',
  description: 'Decode SAML requests/responses and inspect issuer, NameID, and attributes.',
  keywords: ['saml', 'sso', 'decoder', 'xml', 'security'],
}

export default function SamlPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the SAML debugger within the shared layout container. */}
      <SamlDebuggerTool />
    </div>
  )
}
