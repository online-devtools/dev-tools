import MarkdownHTMLTool from '@/components/MarkdownHTMLTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Markdown to HTML Converter - 마크다운을 HTML로 변환',
  description: 'Markdown을 HTML로 변환하고 미리보기를 제공합니다.',
  keywords: ['markdown', 'html', 'converter', 'md', '변환'],
}

export default function MarkdownHTMLPage() {
  return <MarkdownHTMLTool />
}
