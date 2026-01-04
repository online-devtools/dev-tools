import { buildLocalizedPathname, SupportedLanguage } from '@/utils/i18n'

export type HomeToolItem = {
  nameKey: string
  descKey?: string
  path: string
  icon?: string
}

export type HomeToolCategory = {
  categoryKey: string
  items: HomeToolItem[]
}

interface HomeItemListSchemaArgs {
  categories: HomeToolCategory[]
  language: SupportedLanguage
  t: (key: string) => string
  baseUrl: string
  pagePath?: string
}

export const buildHomeItemListSchema = ({
  categories,
  language,
  t,
  baseUrl,
  pagePath = '/',
}: HomeItemListSchemaArgs) => {
  // Flatten categories into a single ordered list so the schema reflects the UI order.
  const items = categories.flatMap((category) => category.items)
  // Build the localized home URL to keep the schema consistent with hreflang tags.
  const homeUrl = new URL(buildLocalizedPathname(pagePath, language), baseUrl).toString()

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('home.title'),
    description: t('home.hero.subtitle'),
    url: homeUrl,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((tool, index) => {
      // Each list item exposes the tool name and absolute URL for AI/search engines.
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: t(tool.nameKey),
        url: new URL(buildLocalizedPathname(tool.path, language), baseUrl).toString(),
      }
    }),
  }
}
