// Favicon HTML tag generator for embedding in <head>.
// The generator assumes PNG outputs for sizes and standard Apple/manifest assets.

export type FaviconOptions = {
  basePath: string
  sizes: number[]
  includeApple?: boolean
  includeManifest?: boolean
}

export const buildFaviconTags = (options: FaviconOptions): string => {
  const tags: string[] = []
  const base = options.basePath.replace(/\/$/, '')

  options.sizes.forEach((size) => {
    tags.push(
      `<link rel="icon" type="image/png" sizes="${size}x${size}" href="${base}/favicon-${size}x${size}.png">`
    )
  })

  if (options.includeApple) {
    // Apple touch icons typically use a 180x180 PNG.
    tags.push(`<link rel="apple-touch-icon" sizes="180x180" href="${base}/apple-touch-icon.png">`)
  }

  if (options.includeManifest) {
    // Web app manifest allows browsers to pick appropriate icons.
    tags.push(`<link rel="manifest" href="${base}/site.webmanifest">`)
  }

  return tags.join('\n')
}
