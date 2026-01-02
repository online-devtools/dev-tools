import type { Metadata } from 'next'
import PatchLinterTool from '@/components/PatchLinterTool'

// Metadata helps surface the patch linter in search results.

export default function PatchLinterPage() {
  // Render the patch linter tool on its dedicated page.
  return <PatchLinterTool />
}
