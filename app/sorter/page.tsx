import SortTool from '@/components/SortTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Text/Code Sorter',
  description: 'Sort and deduplicate text lines by alphabet, length, or numeric value.',
}

export default function SorterPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <SortTool />
    </div>
  )
}
