import type { Metadata } from 'next'
import GhaWorkflowTool from '@/components/GhaWorkflowTool'

export const metadata: Metadata = {
  title: 'GitHub Actions Workflow Linter',
  description: 'Review workflow YAML for risky settings and unpinned actions.',
  keywords: ['github actions', 'workflow', 'linter', 'ci'],
}

export default function GhaWorkflowPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <GhaWorkflowTool />
    </div>
  )
}
