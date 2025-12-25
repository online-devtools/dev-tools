import { describe, expect, it } from 'vitest'
import { resolveSiteBaseUrl } from '@/utils/siteUrl'

// This suite verifies how we pick a canonical site URL for SEO metadata.
// The goal is to ensure our selection logic is deterministic across environments.
describe('resolveSiteBaseUrl', () => {
  it('prefers NEXT_PUBLIC_SITE_URL when it is provided', () => {
    // Provide a scheme-less URL to ensure the normalizer adds https:// correctly.
    const env = { NEXT_PUBLIC_SITE_URL: 'example.com' } as NodeJS.ProcessEnv

    // The explicit URL should win over any Vercel or default fallback values.
    expect(resolveSiteBaseUrl(env)).toBe('https://example.com')
  })

  it('falls back to VERCEL_URL when NEXT_PUBLIC_SITE_URL is missing', () => {
    // Simulate the Vercel-provided deployment hostname (no scheme included).
    const env = { VERCEL_URL: 'preview-vercel.app' } as NodeJS.ProcessEnv

    // The resolver should prefix https:// and use the deployment hostname.
    expect(resolveSiteBaseUrl(env)).toBe('https://preview-vercel.app')
  })

  it('uses the hardcoded default when no environment hints are present', () => {
    // Provide an empty env object to force the default fallback path.
    const env = {} as NodeJS.ProcessEnv

    // The default value matches the public production domain for this project.
    expect(resolveSiteBaseUrl(env)).toBe('https://dev-tools-online.vercel.app')
  })
})
