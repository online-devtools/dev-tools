import { describe, expect, it } from 'vitest'
import {
  getRelatedToolsForPathname,
  resolveToolByPathname,
} from '@/utils/relatedTools'

// Test the path-to-tool resolver to keep SEO schemas and related links consistent.
describe('resolveToolByPathname', () => {
  it('maps a tool pathname to its tool key and category', () => {
    // Base64 is in the encoding category; we expect the mapping to be stable.
    const tool = resolveToolByPathname('/base64')

    expect(tool?.toolKey).toBe('base64')
    expect(tool?.categoryKey).toBe('category.encoding')
  })

  it('normalizes language prefixes and trailing slashes', () => {
    // The resolver should ignore locale prefixes and trailing slashes from the URL.
    const tool = resolveToolByPathname('/en/base64/')

    expect(tool?.toolKey).toBe('base64')
  })
})

// Test related-tool suggestions to ensure we exclude the current tool and keep order.
describe('getRelatedToolsForPathname', () => {
  it('returns same-category tools in config order', () => {
    // Base64 should relate to other encoding tools in the configured sequence.
    const related = getRelatedToolsForPathname('/base64', 3)
    const relatedPaths = related.map((tool) => tool.path)

    expect(relatedPaths).toEqual(['/url', '/html-entities', '/base64-file'])
  })

  it('returns an empty list for unknown paths', () => {
    // Unknown paths should yield no related tools instead of throwing.
    const related = getRelatedToolsForPathname('/does-not-exist', 3)

    expect(related).toEqual([])
  })
})
