import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('metadata verification', () => {
  it('includes the Microsoft verification meta tag in the root layout', () => {
    // Read the layout source directly to confirm the tag is wired in metadata.
    const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx')
    const layoutSource = fs.readFileSync(layoutPath, 'utf8')

    expect(layoutSource).toContain('msvalidate.01')
    expect(layoutSource).toContain('33260982A16D04E9CE1FAE1D749F510F')
  })
})
