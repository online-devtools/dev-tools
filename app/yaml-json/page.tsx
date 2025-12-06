import YAMLJSONTool from '@/components/YAMLJSONTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YAML ↔ JSON Converter - YAML과 JSON 상호 변환',
  description: 'YAML과 JSON 형식을 상호 변환합니다. 설정 파일 형식 변환에 유용합니다.',
  keywords: ['yaml', 'json', 'converter', 'yml', '변환'],
}

export default function YAMLJSONPage() {
  return <YAMLJSONTool />
}
