import fs from 'fs'
import path from 'path'
import { toolCategories } from '@/config/tools'
import { stripLanguageFromPathname } from '@/utils/i18n'
import { CATEGORY_PATH_PREFIX, CATEGORY_SLUGS, getCategoryPath } from '@/utils/categoryRoutes'

// Resolve the absolute app directory once so path joins stay consistent.
const APP_DIR = path.join(process.cwd(), 'app')

// Normalize a route path by removing language prefixes and trailing slashes.
const normalizeRoutePath = (pathname: string): string => {
  const normalized = stripLanguageFromPathname(pathname).pathname.replace(/\/$/, '')
  return normalized === '' ? '/' : normalized
}

// Collect unique tool paths from the config so sitemap generation stays in sync.
export const getToolPathsFromConfig = (): string[] => {
  const paths = toolCategories.flatMap((category) => category.tools.map((tool) => tool.path))
  const unique = Array.from(new Set(paths))

  // Sort paths for deterministic sitemap output and easier testing.
  return unique.sort()
}

// Build category hub paths from the known slug map.
export const getCategoryPaths = (): string[] => {
  const paths = Object.keys(CATEGORY_SLUGS)
    .map((categoryKey) => getCategoryPath(categoryKey))
    .filter((value): value is string => Boolean(value))

  return paths.sort()
}

// Attempt to resolve a route to its page file and return the file mtime.
export const resolveRouteLastModified = (pathname: string, fallback: Date): Date => {
  const normalized = normalizeRoutePath(pathname)

  // Build a list of candidate page files to check for this route.
  const candidates: string[] = []
  if (normalized === '/') {
    candidates.push(path.join(APP_DIR, 'page.tsx'))
  } else if (normalized.startsWith(`${CATEGORY_PATH_PREFIX}/`)) {
    // Category pages are dynamic; they share a single `[category]` page file.
    candidates.push(path.join(APP_DIR, 'category', '[category]', 'page.tsx'))
  } else {
    // Default case: map `/foo/bar` to `app/foo/bar/page.tsx`.
    const trimmed = normalized.replace(/^\//, '')
    candidates.push(path.join(APP_DIR, trimmed, 'page.tsx'))
  }

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath)
      return new Date(stats.mtimeMs)
    }
  }

  // Fallback keeps sitemap stable when no matching file exists.
  return fallback
}
