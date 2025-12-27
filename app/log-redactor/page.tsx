import type { Metadata } from 'next'
import LogRedactorTool from '@/components/LogRedactorTool'

// Metadata is used for SEO and sharing previews.
export const metadata: Metadata = {
  title: 'Log Redactor - Mask Sensitive Data',
  description: 'Redact emails, IPs, and JWTs from logs locally without uploading data.',
  keywords: ['log redactor', 'mask', 'jwt', 'email', 'ip'],
}

export default function LogRedactorPage() {
  // Render the tool component directly for the App Router page.
  return <LogRedactorTool />
}
