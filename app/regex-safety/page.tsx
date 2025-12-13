import RegexSafetyTool from '@/components/RegexSafetyTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Regex Safety Checker',
  description: 'Detect risky regex patterns and potential ReDoS issues.',
}

export default function RegexSafetyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <RegexSafetyTool />
    </div>
  )
}
