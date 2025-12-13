import OpenAPITool from '@/components/OpenAPITool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenAPI/Swagger Validator',
  description: 'Validate OpenAPI/Swagger YAML or JSON, browse endpoints, and get sample curl.',
}

export default function OpenAPIPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <OpenAPITool />
    </div>
  )
}
