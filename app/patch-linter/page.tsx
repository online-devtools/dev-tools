import type { Metadata } from 'next'
import PatchLinterTool from '@/components/PatchLinterTool'

// Metadata helps surface the patch linter in search results.
export const metadata: Metadata = {
  title: 'Patch Linter - Diff Hygiene Checks',
  description: 'Lint unified diff files for trailing whitespace, missing newlines, and oversized patches.',
  keywords: ['patch', 'diff', 'lint', 'whitespace', 'git'],
}

export default function PatchLinterPage() {
  // Render the patch linter tool on its dedicated page.
  return <PatchLinterTool />
}
