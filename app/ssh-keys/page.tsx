import type { Metadata } from 'next'
import SshKeyTool from '@/components/SshKeyTool'

export const metadata: Metadata = {
  // Metadata keeps the SSH key tool discoverable.
  title: 'SSH Key Generator & Analyzer',
  description: 'Generate RSA/ECDSA/Ed25519 keys and analyze SSH public key metadata.',
  keywords: ['ssh key', 'rsa', 'ecdsa', 'ed25519', 'generator'],
}

export default function SshKeysPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the SSH key tool inside the shared layout container. */}
      <SshKeyTool />
    </div>
  )
}
