import JSONTOMLTool from '@/components/JSONTOMLTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON ↔ TOML Converter - JSON과 TOML 상호 변환',
  description: 'JSON과 TOML 형식을 상호 변환합니다.',
  keywords: ['json', 'toml', 'converter', '변환'],
}

export default function JSONTOMLPage() {
  return <JSONTOMLTool />
}
