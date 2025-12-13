import type { Metadata } from 'next'
import CurlConverterTool from '@/components/CurlConverterTool'

export const metadata: Metadata = {
  title: 'cURL to Code Converter - Convert cURL to Any Language',
  description: 'Convert cURL commands to JavaScript (Fetch, Axios), Python, Node.js, PHP, and more. Easily convert API requests to code.',
  keywords: ['curl', 'curl converter', 'curl to code', 'api', 'fetch', 'axios', 'python requests', 'http client'],
}

export default function CurlConverterPage() {
  return <CurlConverterTool />
}
