import JSONMinifyTool from '@/components/JSONMinifyTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Minify - JSON 압축',
  description: 'JSON을 압축하여 공백과 줄바꿈을 제거합니다.',
  keywords: ['json', 'minify', 'compress', '압축', '최소화'],
}

export default function JSONMinifyPage() {
  return <JSONMinifyTool />
}
