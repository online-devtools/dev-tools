import { describe, expect, it } from 'vitest'
import { parsePackageJsonDependencies } from '@/utils/dependencyParser'

// Dependency parsing is needed before checking registry versions.
describe('dependencyParser utils', () => {
  it('extracts dependencies and devDependencies', () => {
    // Provide a minimal package.json structure for parsing.
    const input = JSON.stringify({
      dependencies: { react: '^18.2.0' },
      devDependencies: { typescript: '^5.0.0' },
    })

    const parsed = parsePackageJsonDependencies(input)

    expect(parsed.dependencies).toEqual({ react: '^18.2.0' })
    expect(parsed.devDependencies).toEqual({ typescript: '^5.0.0' })
  })
})
