// Content Security Policy (CSP) builder for assembling header strings.
// The output is ordered to keep diffs stable in security reviews.

export type CspDirectives = Record<string, string[]>

const DEFAULT_ORDER = [
  'default-src',
  'script-src',
  'style-src',
  'img-src',
  'font-src',
  'connect-src',
  'media-src',
  'object-src',
  'frame-src',
  'child-src',
  'worker-src',
  'manifest-src',
  'base-uri',
  'form-action',
  'frame-ancestors',
  'upgrade-insecure-requests',
  'block-all-mixed-content',
]

export const buildCspHeader = (directives: CspDirectives): string => {
  // Normalize input to avoid undefined entries in the output.
  const entries = Object.entries(directives)
    .filter(([, values]) => Array.isArray(values) && values.length > 0)

  const directiveMap = new Map(entries)
  const orderedKeys = [
    ...DEFAULT_ORDER.filter((key) => directiveMap.has(key)),
    ...Array.from(directiveMap.keys()).filter((key) => !DEFAULT_ORDER.includes(key)).sort(),
  ]

  return orderedKeys
    .map((key) => `${key} ${directiveMap.get(key)!.join(' ')}`.trim())
    .join('; ')
}
