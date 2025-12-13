import type { Metadata } from 'next'
import EnvManagerTool from '@/components/EnvManagerTool'

export const metadata: Metadata = {
  title: 'Environment Variables Manager - .env File Editor',
  description: 'Manage environment variables with ease. Create, edit, and convert .env files to JSON, YAML, or export format. Supports comments and validation.',
  keywords: ['env', 'environment variables', '.env', 'dotenv', 'env file', 'config', 'env manager'],
}

export default function EnvManagerPage() {
  return <EnvManagerTool />
}
