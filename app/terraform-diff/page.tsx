import type { Metadata } from 'next'
import TerraformDiffTool from '@/components/TerraformDiffTool'

export const metadata: Metadata = {
  title: 'Terraform Diff & Validator',
  description: 'Compare Terraform plans/configs and flag risky keywords.',
  keywords: ['terraform', 'hcl', 'diff', 'validator'],
}

export default function TerraformDiffPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <TerraformDiffTool />
    </div>
  )
}
