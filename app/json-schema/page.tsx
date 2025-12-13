import type { Metadata } from 'next'
import JSONSchemaGeneratorTool from '@/components/JSONSchemaGeneratorTool'

export const metadata: Metadata = {
  title: 'JSON Schema Generator - Auto Generate JSON Schema from JSON',
  description: 'Automatically generate JSON Schema from JSON data. Free online JSON Schema generator with customizable options for required fields and descriptions.',
  keywords: ['JSON Schema', 'schema generator', 'JSON validator', 'JSON Schema draft-07', 'auto generate schema', 'JSON to schema'],
}

export default function JSONSchemaPage() {
  return <JSONSchemaGeneratorTool />
}
