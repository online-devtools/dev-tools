import { describe, expect, it } from 'vitest'
import { listJsonPaths } from '@/utils/jsonPath'

// JSONPath listing should surface all leaf nodes with stable paths.
describe('jsonPath utils', () => {
  it('lists JSONPath expressions for nested JSON', () => {
    // Provide nested JSON data to verify path construction.
    const input = JSON.stringify({
      user: { name: 'Ada', tags: ['dev', 'ops'] },
      active: true,
    })

    const paths = listJsonPaths(input)

    expect(paths).toEqual([
      { path: '$.user.name', value: 'Ada' },
      { path: '$.user.tags[0]', value: 'dev' },
      { path: '$.user.tags[1]', value: 'ops' },
      { path: '$.active', value: true },
    ])
  })
})
