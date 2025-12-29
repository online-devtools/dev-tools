import type { Metadata } from 'next'
import PaginationTesterTool from '@/components/PaginationTesterTool'

export const metadata: Metadata = {
  title: 'API Pagination Tester',
  description: 'Test cursor or page-based pagination and detect duplicates.',
  keywords: ['pagination', 'api testing', 'cursor', 'page'],
}

export default function PaginationTesterPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PaginationTesterTool />
    </div>
  )
}
