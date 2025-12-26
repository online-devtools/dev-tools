import { describe, expect, it } from 'vitest'
import { buildFaviconTags } from '@/utils/favicon'

// Favicon HTML snippets must be predictable for copy/paste into <head>.
describe('favicon utils', () => {
  it('builds favicon link tags for multiple sizes', () => {
    const html = buildFaviconTags({
      basePath: '/favicons',
      sizes: [16, 32],
      includeApple: true,
      includeManifest: true,
    })

    expect(html).toBe(
      [
        '<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">',
        '<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">',
        '<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">',
        '<link rel="manifest" href="/favicons/site.webmanifest">',
      ].join('\n')
    )
  })
})
