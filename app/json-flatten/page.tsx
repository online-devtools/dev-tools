import { Metadata } from 'next'
import JSONFlattenTool from '@/components/JSONFlattenTool'

export const metadata: Metadata = {
  // Metadata keeps the JSON flatten tool discoverable by search engines.
  title: 'JSON Flatten - JSON 평탄화',
  description: '중첩 JSON을 평탄화하고(flatten) 다시 복원(unflatten)합니다. 로그 파이프라인과 데이터 매핑에 유용합니다.',
  keywords: ['json flatten', 'json unflatten', 'json', 'converter', '평탄화'],
}

export default function JSONFlattenPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the JSON flatten tool within the shared layout container. */}
      <JSONFlattenTool />
    </div>
  )
}
