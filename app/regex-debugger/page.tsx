import type { Metadata } from 'next'
import RegexDebuggerTool from '@/components/RegexDebuggerTool'

export const metadata: Metadata = {
  // Metadata helps the regex debugger show up in search results.
  title: 'Regex Debugger - 정규식 디버거',
  description: '정규식 매칭 결과와 캡처 그룹을 단계별로 확인합니다.',
  keywords: ['regex debugger', 'regex', '정규식', 'debugger'],
}

export default function RegexDebuggerPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Render the regex debugger inside the shared layout container. */}
      <RegexDebuggerTool />
    </div>
  )
}
