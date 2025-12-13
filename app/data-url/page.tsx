import DataURLTool from '@/components/DataURLTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data URL Converter',
  description: 'Convert files to data URLs and back to files.',
}

export default function DataURLPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <DataURLTool />
    </div>
  )
}
