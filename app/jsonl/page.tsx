import JSONLinesTool from '@/components/JSONLinesTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  // Static metadata keeps the JSONL tool indexable by search engines.
  title: 'JSON Lines Converter - JSONL 변환기',
  description: 'JSON Lines(JSONL)과 JSON 배열을 상호 변환합니다. 로그/데이터 파이프라인에서 자주 쓰이는 JSONL을 빠르게 다룹니다.',
  keywords: ['jsonl', 'json lines', 'json array', 'converter', '변환'],
}

export default function JSONLinesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the converter inside the shared centered layout container. */}
      <JSONLinesTool />
    </div>
  )
}
