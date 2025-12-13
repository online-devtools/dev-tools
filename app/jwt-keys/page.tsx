import JWTKeyTool from '@/components/JWTKeyTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JWT Key Generator (HS/RS)',
  description: 'Generate HS secrets or RSA key pairs for JWT signing, and export JWK.',
}

export default function JwtKeysPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <JWTKeyTool />
    </div>
  )
}
