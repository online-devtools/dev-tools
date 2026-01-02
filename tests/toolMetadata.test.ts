import { describe, expect, it } from 'vitest'
import { resolveToolMetadata } from '@/utils/toolMetadata'
import { translations } from '@/config/translations'

// This suite validates tool-level metadata localization for SEO.
// Each assertion checks both the tool lookup and the language-specific copy selection.
describe('resolveToolMetadata', () => {
  it('returns localized metadata for a known tool path', () => {
    // Base64 is a stable tool with well-defined translation keys in every locale.
    const result = resolveToolMetadata('/base64', 'ko')

    // The metadata should match the Korean tool title and description strings.
    expect(result?.title).toBe(translations.ko['tool.base64'])
    expect(result?.description).toBe(translations.ko['tool.base64.desc'])
  })

  it('normalizes language prefixes before resolving metadata', () => {
    // Paths with language prefixes should resolve to the same underlying tool.
    const result = resolveToolMetadata('/en/base64/', 'en')

    // English metadata should be returned when the language is English.
    expect(result?.title).toBe(translations.en['tool.base64'])
    expect(result?.description).toBe(translations.en['tool.base64.desc'])
  })

  it('returns null for unknown tool paths', () => {
    // Unknown routes should never produce tool metadata.
    const result = resolveToolMetadata('/not-a-tool', 'en')

    // Explicit null makes it easy to skip SEO tool metadata when not applicable.
    expect(result).toBeNull()
  })
})
