'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { buildLocalizedPathname } from '@/utils/i18n'
import { getSiteBaseUrl } from '@/utils/siteUrl'
import { getRelatedToolsForPathname, resolveToolByPathname } from '@/utils/relatedTools'

interface RelatedToolsSectionProps {
  maxItems?: number
}

export default function RelatedToolsSection({ maxItems = 3 }: RelatedToolsSectionProps) {
  const pathname = usePathname()
  const { t, language } = useLanguage()

  // Resolve the current tool from the URL so we only show links on tool pages.
  const currentTool = resolveToolByPathname(pathname)
  // Build related tools using the shared lookup helper and category data.
  const relatedTools = getRelatedToolsForPathname(pathname, maxItems)

  if (!currentTool || relatedTools.length === 0) {
    return null
  }

  // Build an absolute URL for structured data so crawlers can resolve links.
  const siteBaseUrl = getSiteBaseUrl()
  const currentToolUrl = new URL(
    buildLocalizedPathname(currentTool.path, language),
    siteBaseUrl,
  ).toString()

  // JSON-LD ItemList helps AI/search engines understand cross-tool relationships.
  const relatedToolsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('relatedTools.title'),
    description: t('relatedTools.description'),
    url: currentToolUrl,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: relatedTools.map((tool, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: t(tool.nameKey),
        url: new URL(buildLocalizedPathname(tool.path, language), siteBaseUrl).toString(),
      }
    }),
  }

  return (
    <section className="mt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedToolsSchema) }}
      />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="mb-4 space-y-1">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {t('relatedTools.title')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('relatedTools.description')}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {relatedTools.map((tool) => {
            // Localize the link and labels so related tools stay in the active language.
            const toolHref = buildLocalizedPathname(tool.path, language)
            const toolTitle = t(tool.nameKey)
            const toolDescription = t(`${tool.nameKey}.desc`)

            return (
              <Link
                key={tool.path}
                href={toolHref}
                className="group rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-500/60 dark:hover:bg-blue-900/20"
              >
                <div className="text-2xl">{tool.icon}</div>
                <div className="mt-2 font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300">
                  {toolTitle}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {toolDescription}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
