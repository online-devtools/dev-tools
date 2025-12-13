import type { Metadata } from 'next'
import CodeMinifierTool from '@/components/CodeMinifierTool'

export const metadata: Metadata = {
  title: 'Code Minifier - Minify JS, CSS, HTML',
  description: 'Minify and compress JavaScript, CSS, and HTML code. Reduce file size by removing whitespace, comments, and unnecessary characters.',
  keywords: ['minify', 'minifier', 'compress', 'javascript', 'css', 'html', 'optimize', 'beautify'],
}

export default function CodeMinifierPage() {
  return <CodeMinifierTool />
}
