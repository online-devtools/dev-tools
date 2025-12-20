// Normalize a base URL so sitemap/robots always emit absolute URLs.
// This keeps search engines from rejecting entries when the scheme is missing.
export const normalizeBaseUrl = (rawBaseUrl: string): string => {
  // Step 1: trim whitespace because environment variables can contain stray spaces.
  const trimmedBaseUrl = rawBaseUrl.trim()
  // Step 2: if a scheme is already present, keep it and only remove trailing slashes.
  if (/^https?:\/\//i.test(trimmedBaseUrl)) {
    // Removing trailing slashes avoids generating double slashes when concatenating paths.
    return trimmedBaseUrl.replace(/\/+$/, '')
  }
  // Step 3: when the scheme is missing, prepend https for a valid absolute URL.
  return `https://${trimmedBaseUrl}`.replace(/\/+$/, '')
}
