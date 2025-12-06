import YAMLTOMLTool from '@/components/YAMLTOMLTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YAML ↔ TOML Converter - YAML과 TOML 상호 변환',
  description: 'YAML과 TOML 형식을 상호 변환합니다.',
  keywords: ['yaml', 'toml', 'converter', '변환'],
}

export default function YAMLTOMLPage() {
  return <YAMLTOMLTool />
}
