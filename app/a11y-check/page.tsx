import A11yCheckTool from '@/components/A11yCheckTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTML Accessibility Checker',
  description: 'Check HTML snippets for basic accessibility issues (alt/labels/headings).',
}

export default function A11yCheckPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <A11yCheckTool />
    </div>
  )
}
