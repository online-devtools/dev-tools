import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { toolCategories } from '@/config/tools'
import { CATEGORY_SLUGS, getCategoryKeyBySlug, getCategoryPath } from '@/utils/categoryRoutes'
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_HEADER,
  SupportedLanguage,
  buildLocalizedPathname,
  isSupportedLanguage,
} from '@/utils/i18n'
import { getSiteBaseUrl } from '@/utils/siteUrl'
import { getTranslationOrKey, translate } from '@/utils/translationHelpers'

type CategoryPageParams = {
  category: string
}

// Resolve the request language from middleware headers with a safe fallback.
const resolveRequestLanguage = async (): Promise<SupportedLanguage> => {
  const requestHeaders = await headers()
  const headerLanguage = requestHeaders.get(LANGUAGE_HEADER)
  return isSupportedLanguage(headerLanguage) ? headerLanguage : DEFAULT_LANGUAGE
}

// Prebuild static category paths for every known slug.
export const generateStaticParams = (): CategoryPageParams[] => {
  return Object.values(CATEGORY_SLUGS).map((slug) => ({ category: slug }))
}

// Generate localized metadata for category hub pages.
export const generateMetadata = async ({
  params,
}: {
  params: Promise<CategoryPageParams>
}): Promise<Metadata> => {
  const language = await resolveRequestLanguage()
  const resolvedParams = await params
  const categoryKey = getCategoryKeyBySlug(resolvedParams.category)

  if (!categoryKey) {
    return {
      title: getTranslationOrKey(language, 'site.title'),
      description: getTranslationOrKey(language, 'site.description'),
    }
  }

  const categoryName = getTranslationOrKey(language, categoryKey)
  return {
    title: translate(language, 'categoryPage.title', { category: categoryName }),
    description: translate(language, 'categoryPage.description', { category: categoryName }),
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<CategoryPageParams>
}) {
  const language = await resolveRequestLanguage()
  const resolvedParams = await params
  const categoryKey = getCategoryKeyBySlug(resolvedParams.category)

  if (!categoryKey) {
    notFound()
  }

  // Locate the category details from the shared tool config.
  const category = toolCategories.find((entry) => entry.categoryKey === categoryKey)
  if (!category) {
    notFound()
  }

  const categoryName = getTranslationOrKey(language, categoryKey)
  const title = translate(language, 'categoryPage.title', { category: categoryName })
  const description = translate(language, 'categoryPage.description', { category: categoryName })
  const homeLabel = getTranslationOrKey(language, 'nav.home')
  const categoryPath = getCategoryPath(categoryKey) ?? '/'

  const siteBaseUrl = getSiteBaseUrl()
  const categoryUrl = new URL(buildLocalizedPathname(categoryPath, language), siteBaseUrl).toString()

  // Build structured data for breadcrumbs and category lists to boost internal linking signals.
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeLabel,
        item: new URL(buildLocalizedPathname('/', language), siteBaseUrl).toString(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: categoryUrl,
      },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: categoryName,
    description,
    url: categoryUrl,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: category.tools.map((tool, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: getTranslationOrKey(language, tool.nameKey),
        url: new URL(buildLocalizedPathname(tool.path, language), siteBaseUrl).toString(),
      }
    }),
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <header className="space-y-2">
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">
          {categoryName}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {category.tools.map((tool) => {
          const toolTitle = getTranslationOrKey(language, tool.nameKey)
          const toolDescription = getTranslationOrKey(language, `${tool.nameKey}.desc`)
          const href = buildLocalizedPathname(tool.path, language)

          return (
            <Link
              key={tool.path}
              href={href}
              className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tool.icon}</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300">
                  {toolTitle}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {toolDescription}
              </p>
            </Link>
          )
        })}
      </section>
    </div>
  )
}
