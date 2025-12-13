import HttpBuilderTool from '@/components/HttpBuilderTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTTP Request Builder',
  description: 'Compose HTTP requests and generate fetch/Axios snippets offline.',
}

export default function HttpBuilderPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <HttpBuilderTool />
    </div>
  )
}
