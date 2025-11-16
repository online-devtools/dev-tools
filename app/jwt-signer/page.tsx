import JWTSignerTool from '@/components/JWTSignerTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JWT Signer - Developer Tools',
  description: 'Create HS256/384/512 signed JWT tokens directly in the browser. Perfect for testing authentication flows without exposing secrets.',
  keywords: ['JWT', 'JWT signer', 'HS256', 'token generator', 'developer tools'],
  openGraph: {
    title: 'JWT Signer - Developer Tools',
    description: 'Generate signed JWT tokens for QA and debugging workflows.',
  },
}

export default function JWTSignerPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <JWTSignerTool />
    </div>
  )
}

