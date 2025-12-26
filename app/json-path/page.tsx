import type { Metadata } from 'next'
import JSONPathFinderTool from '@/components/JSONPathFinderTool'

export const metadata: Metadata = {
  // Metadata helps the JSONPath tool appear in search results.
  title: 'JSONPath Finder - JSON 경로 찾기',
  description: 'JSON에서 JSONPath를 자동으로 추출해 필요한 값을 빠르게 찾습니다.',
  keywords: ['jsonpath', 'json path', 'json', 'finder'],
}

export default function JSONPathFinderPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the JSONPath finder within the shared layout container. */}
      <JSONPathFinderTool />
    </div>
  )
}
