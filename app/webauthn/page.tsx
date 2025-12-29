import type { Metadata } from 'next'
import WebAuthnTool from '@/components/WebAuthnTool'

export const metadata: Metadata = {
  title: 'WebAuthn Ceremony Tester',
  description: 'Decode WebAuthn registration and authentication payloads.',
  keywords: ['webauthn', 'passkeys', 'fido2', 'authenticator'],
}

export default function WebAuthnPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <WebAuthnTool />
    </div>
  )
}
