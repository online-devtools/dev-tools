import type { Metadata } from 'next'
import ApiContractTesterTool from '@/components/ApiContractTesterTool'

export const metadata: Metadata = {
  title: 'API Contract Tester',
  description: 'Validate OpenAPI or GraphQL responses against contract expectations.',
  keywords: ['openapi', 'graphql', 'contract testing', 'api validator'],
}

export default function ApiContractTesterPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <ApiContractTesterTool />
    </div>
  )
}
