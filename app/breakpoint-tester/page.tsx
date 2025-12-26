import type { Metadata } from 'next'
import BreakpointTesterTool from '@/components/BreakpointTesterTool'

export const metadata: Metadata = {
  // SEO metadata for responsive breakpoint preview searches.
  title: 'Responsive Breakpoint Tester',
  description: 'Preview any URL at common viewport sizes to validate responsive layouts.',
  keywords: ['responsive tester', 'breakpoint tester', 'viewport preview', 'responsive design'],
}

export default function BreakpointTesterPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Allow wider preview frames for large breakpoint lists. */}
      <BreakpointTesterTool />
    </div>
  )
}
