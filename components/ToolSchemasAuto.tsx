'use client'

import { usePathname } from 'next/navigation'
import ToolSchemas, { CATEGORY_TYPE_MAP } from './ToolSchemas'
import { resolveToolByPathname } from '@/utils/relatedTools'

export default function ToolSchemasAuto() {
  // `usePathname` reads the current route on the client so we can map it to tool metadata.
  const pathname = usePathname()

  // Use the shared resolver to match the current URL to a known tool.
  const tool = resolveToolByPathname(pathname)

  if (!tool) {
    return null
  }

  // Fall back to a safe category type when the mapping is missing.
  const categoryType = CATEGORY_TYPE_MAP[tool.categoryKey] ?? 'generator'

  return (
    <ToolSchemas
      toolKey={tool.toolKey}
      toolPath={tool.path}
      categoryKey={tool.categoryKey}
      categoryType={categoryType}
    />
  )
}
