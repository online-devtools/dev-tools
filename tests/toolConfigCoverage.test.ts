import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'

const readSource = (relativePath: string) => {
  // Resolve paths from the repo root so the test runs from any working directory.
  const absolutePath = path.join(process.cwd(), relativePath)
  // Read the source as UTF-8 so regex extraction matches the literal strings.
  return fs.readFileSync(absolutePath, 'utf8')
}

const extractPaths = (source: string) => {
  // Match object-literal `path: '/foo'` entries in the home page tool catalog.
  const pathPattern = /path:\\s*'([^']+)'/g
  const paths = new Set<string>()
  let match: RegExpExecArray | null

  // Scan the entire file so we capture every tool entry in the catalog list.
  while ((match = pathPattern.exec(source))) {
    paths.add(match[1])
  }

  return paths
}

describe('tool config coverage', () => {
  it('keeps config/tools.ts aligned with the home page tool catalog', () => {
    // app/page.tsx is the canonical tool list that marketing and SEO rely on.
    const homeCatalog = readSource(path.join('app', 'page.tsx'))
    // config/tools.ts powers schemas and related tools, so it must include the same paths.
    const configCatalog = readSource(path.join('config', 'tools.ts'))

    const homePaths = extractPaths(homeCatalog)
    const configPaths = extractPaths(configCatalog)
    const missing = [...homePaths].filter((toolPath) => !configPaths.has(toolPath))

    // Any missing path would drop structured data and related links for that tool.
    expect(missing).toEqual([])
  })
})
