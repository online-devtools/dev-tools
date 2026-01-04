import { toolCategories, ToolKey } from '@/config/tools'
import { stripLanguageFromPathname } from '@/utils/i18n'

// Shared shape for tool metadata used in related links and schema generation.
export type ToolLookupItem = {
  nameKey: string
  path: string
  icon: string
  categoryKey: string
  toolKey: ToolKey
}

// Normalize incoming paths so lookups work for `/en/foo/` and `/foo`.
const normalizeToolPath = (pathname: string): string => {
  // Always start with a slash to keep path comparisons consistent.
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  const stripped = stripLanguageFromPathname(normalized).pathname

  // Trim trailing slashes for non-root paths to match config entries.
  if (stripped.length > 1 && stripped.endsWith('/')) {
    return stripped.slice(0, -1)
  }

  return stripped
}

// Precompute a flat list of tools with category info for fast lookups.
const TOOL_INDEX: ToolLookupItem[] = toolCategories.flatMap((category) => {
  return category.tools.map((tool) => {
    // The tool key mirrors the translation key suffix (e.g., `tool.base64` → `base64`).
    const toolKey = tool.nameKey.replace(/^tool\./, '') as ToolKey

    return {
      ...tool,
      toolKey,
      categoryKey: category.categoryKey,
    }
  })
})

// Resolve a pathname to a tool entry so we can attach schemas and related links.
export const resolveToolByPathname = (pathname: string): ToolLookupItem | null => {
  const normalized = normalizeToolPath(pathname)
  const match = TOOL_INDEX.find((tool) => tool.path === normalized)

  return match ?? null
}

// Pick related tools from the same category, excluding the current tool.
export const getRelatedToolsForPathname = (
  pathname: string,
  maxItems = 3,
): ToolLookupItem[] => {
  if (maxItems <= 0) {
    return []
  }

  const currentTool = resolveToolByPathname(pathname)
  if (!currentTool) {
    return []
  }

  const related = TOOL_INDEX.filter((tool) => {
    return tool.categoryKey === currentTool.categoryKey && tool.path !== currentTool.path
  })

  return related.slice(0, maxItems)
}
