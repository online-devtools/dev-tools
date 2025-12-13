import CryptoBundleTool from '@/components/CryptoBundleTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crypto/Compression Bundle',
  description: 'AES-GCM encrypt/decrypt, Base64 encode/decode, and random seed generation.',
}

export default function CryptoBundlePage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <CryptoBundleTool />
    </div>
  )
}
