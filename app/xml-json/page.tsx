import XMLJSONTool from '@/components/XMLJSONTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'XML ↔ JSON Converter - XML과 JSON 상호 변환',
  description: 'XML과 JSON 형식을 상호 변환합니다.',
  keywords: ['xml', 'json', 'converter', '변환'],
}

export default function XMLJSONPage() {
  return <XMLJSONTool />
}
