import type { Metadata } from 'next'
import WebhookTesterTool from '@/components/WebhookTesterTool'

export const metadata: Metadata = {
  title: 'Webhook Tester',
  description: 'Receive webhooks, verify signatures, and replay payloads safely.',
  keywords: ['webhook', 'signature verification', 'replay', 'hmac'],
}

export default function WebhookTesterPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <WebhookTesterTool />
    </div>
  )
}
