'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import TextAreaWithCopy from './TextAreaWithCopy'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MetaTagsTool() {
  const { t } = useLanguage()

  // Basic meta tags
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [author, setAuthor] = useState('')
  const [robots, setRobots] = useState('index, follow')
  const [canonical, setCanonical] = useState('')

  // Open Graph
  const [ogTitle, setOgTitle] = useState('')
  const [ogDescription, setOgDescription] = useState('')
  const [ogImage, setOgImage] = useState('')
  const [ogUrl, setOgUrl] = useState('')
  const [ogType, setOgType] = useState('website')
  const [ogSiteName, setOgSiteName] = useState('')

  // Twitter Card
  const [twitterCard, setTwitterCard] = useState('summary_large_image')
  const [twitterSite, setTwitterSite] = useState('')
  const [twitterCreator, setTwitterCreator] = useState('')

  const generateMetaTags = () => {
    const tags: string[] = []

    // Basic meta tags
    if (title) {
      tags.push(`<title>${title}</title>`)
      tags.push(`<meta name="title" content="${title}">`)
    }
    if (description) {
      tags.push(`<meta name="description" content="${description}">`)
    }
    if (keywords) {
      tags.push(`<meta name="keywords" content="${keywords}">`)
    }
    if (author) {
      tags.push(`<meta name="author" content="${author}">`)
    }
    if (robots) {
      tags.push(`<meta name="robots" content="${robots}">`)
    }
    if (canonical) {
      tags.push(`<link rel="canonical" href="${canonical}">`)
    }

    // Open Graph
    if (ogTitle || title) {
      tags.push(`<meta property="og:title" content="${ogTitle || title}">`)
    }
    if (ogDescription || description) {
      tags.push(`<meta property="og:description" content="${ogDescription || description}">`)
    }
    if (ogImage) {
      tags.push(`<meta property="og:image" content="${ogImage}">`)
    }
    if (ogUrl) {
      tags.push(`<meta property="og:url" content="${ogUrl}">`)
    }
    if (ogType) {
      tags.push(`<meta property="og:type" content="${ogType}">`)
    }
    if (ogSiteName) {
      tags.push(`<meta property="og:site_name" content="${ogSiteName}">`)
    }

    // Twitter Card
    if (twitterCard) {
      tags.push(`<meta name="twitter:card" content="${twitterCard}">`)
    }
    if (ogTitle || title) {
      tags.push(`<meta name="twitter:title" content="${ogTitle || title}">`)
    }
    if (ogDescription || description) {
      tags.push(`<meta name="twitter:description" content="${ogDescription || description}">`)
    }
    if (ogImage) {
      tags.push(`<meta name="twitter:image" content="${ogImage}">`)
    }
    if (twitterSite) {
      tags.push(`<meta name="twitter:site" content="${twitterSite}">`)
    }
    if (twitterCreator) {
      tags.push(`<meta name="twitter:creator" content="${twitterCreator}">`)
    }

    return tags.join('\n')
  }

  const metaTags = generateMetaTags()

  return (
    <ToolCard
      title={t('metaTags.title')}
      description={t('metaTags.description')}
    >
      <div className="space-y-6">
        {/* Basic Meta Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('metaTags.basicSection')}
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('metaTags.titleLabel')} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('metaTags.titlePlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('metaTags.titleHint')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('metaTags.descriptionLabel')} *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('metaTags.descriptionPlaceholder')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('metaTags.descriptionHint')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('metaTags.keywordsLabel')}
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder={t('metaTags.keywordsPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('metaTags.authorLabel')}
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={t('metaTags.authorPlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('metaTags.robotsLabel')}
              </label>
              <select
                value={robots}
                onChange={(e) => setRobots(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="index, follow">index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('metaTags.canonicalLabel')}
              </label>
              <input
                type="url"
                value={canonical}
                onChange={(e) => setCanonical(e.target.value)}
                placeholder="https://example.com/page"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Open Graph */}
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('metaTags.ogSection')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('metaTags.ogTitleLabel')}
              </label>
              <input
                type="text"
                value={ogTitle}
                onChange={(e) => setOgTitle(e.target.value)}
                placeholder={t('metaTags.ogTitlePlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('metaTags.ogTypeLabel')}
              </label>
              <select
                value={ogType}
                onChange={(e) => setOgType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="product">product</option>
                <option value="profile">profile</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('metaTags.ogDescriptionLabel')}
            </label>
            <textarea
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              placeholder={t('metaTags.ogDescriptionPlaceholder')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('metaTags.ogImageLabel')} *
              </label>
              <input
                type="url"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('metaTags.ogImageHint')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('metaTags.ogUrlLabel')}
              </label>
              <input
                type="url"
                value={ogUrl}
                onChange={(e) => setOgUrl(e.target.value)}
                placeholder="https://example.com/page"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('metaTags.ogSiteNameLabel')}
            </label>
            <input
              type="text"
              value={ogSiteName}
              onChange={(e) => setOgSiteName(e.target.value)}
              placeholder={t('metaTags.ogSiteNamePlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Twitter Card */}
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('metaTags.twitterSection')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('metaTags.twitterCardLabel')}
              </label>
              <select
                value={twitterCard}
                onChange={(e) => setTwitterCard(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="summary">summary</option>
                <option value="summary_large_image">summary_large_image</option>
                <option value="app">app</option>
                <option value="player">player</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('metaTags.twitterSiteLabel')}
              </label>
              <input
                type="text"
                value={twitterSite}
                onChange={(e) => setTwitterSite(e.target.value)}
                placeholder="@username"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('metaTags.twitterCreatorLabel')}
              </label>
              <input
                type="text"
                value={twitterCreator}
                onChange={(e) => setTwitterCreator(e.target.value)}
                placeholder="@username"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Generated Meta Tags */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <TextAreaWithCopy
            value={metaTags}
            readOnly
            label={t('metaTags.output')}
            rows={15}
          />
        </div>

        {/* Preview */}
        {(title || ogImage) && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('metaTags.preview')}
            </h3>

            {/* Social Media Card Preview */}
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 max-w-md">
              {ogImage && (
                <img
                  src={ogImage}
                  alt="OG"
                  className="w-full h-48 object-cover bg-gray-200 dark:bg-gray-700"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="315"%3E%3Crect fill="%23ddd" width="600" height="315"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage%3C/text%3E%3C/svg%3E'
                  }}
                />
              )}
              <div className="p-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {ogUrl || canonical || 'example.com'}
                </div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                  {ogTitle || title || 'Page Title'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {ogDescription || description || 'Page description'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {t('metaTags.infoTitle')}
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
            <li>{t('metaTags.info1')}</li>
            <li>{t('metaTags.info2')}</li>
            <li>{t('metaTags.info3')}</li>
          </ul>
        </div>
      </div>
    </ToolCard>
  )
}
