import { SupportedLanguage } from '@/utils/i18n'
import { getTranslationOrKey, getTranslationOrNull } from '@/utils/translationHelpers'
import { resolveToolByPathname } from '@/utils/relatedTools'

// A lightweight shape for SEO metadata that we can reuse in layouts or routes.
export type ToolMetadata = {
  title: string
  description: string
  toolKey: string
  path: string
}

// Resolve tool-specific metadata based on the current pathname and language.
export const resolveToolMetadata = (
  pathname: string,
  language: SupportedLanguage,
): ToolMetadata | null => {
  // Map the URL path to a tool entry so we can pull translation keys consistently.
  const tool = resolveToolByPathname(pathname)
  if (!tool) {
    return null
  }

  // Tool title comes from the tool name key; description prefers the tool desc key.
  const title = getTranslationOrKey(language, tool.nameKey)
  const description =
    getTranslationOrNull(language, `${tool.nameKey}.desc`) ??
    getTranslationOrNull(language, `${tool.toolKey}.description`) ??
    title

  return {
    title,
    description,
    toolKey: tool.toolKey,
    path: tool.path,
  }
}
