import type { Metadata } from 'next'
import OAuthPlaygroundTool from '@/components/OAuthPlaygroundTool'

export const metadata: Metadata = {
  // Metadata keeps the OAuth playground indexed for auth workflows.
  title: 'OAuth 2.0 Playground - PKCE Builder',
  description: 'Generate OAuth authorization URLs, PKCE verifier/challenge, and token request payloads.',
  keywords: ['oauth', 'pkce', 'authorization code', 'token'],
}

export default function OAuthPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the OAuth playground inside the shared layout container. */}
      <OAuthPlaygroundTool />
    </div>
  )
}
