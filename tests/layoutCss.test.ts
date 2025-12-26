import { describe, expect, it } from 'vitest'
import { buildLayoutCss } from '@/utils/layoutCss'

// Layout CSS generation must be deterministic for copy/paste usage.
describe('layoutCss utils', () => {
  it('builds flexbox CSS rules from settings', () => {
    const css = buildLayoutCss({
      mode: 'flex',
      direction: 'row',
      justify: 'center',
      align: 'stretch',
      gap: 12,
      wrap: 'wrap',
    })

    expect(css).toBe(
      [
        'display: flex;',
        'flex-direction: row;',
        'justify-content: center;',
        'align-items: stretch;',
        'gap: 12px;',
        'flex-wrap: wrap;',
      ].join('\n')
    )
  })
})
