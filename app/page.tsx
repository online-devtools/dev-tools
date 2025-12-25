'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

// Tool configuration with translation keys
const toolsConfig = [
  {
    categoryKey: 'category.encoding',
    items: [
      { nameKey: 'tool.base64', path: '/base64', icon: '🔤', descKey: 'tool.base64.desc' },
      { nameKey: 'tool.url', path: '/url', icon: '🔗', descKey: 'tool.url.desc' },
      { nameKey: 'tool.htmlEntities', path: '/html-entities', icon: '&', descKey: 'tool.htmlEntities.desc' },
      { nameKey: 'tool.base64File', path: '/base64-file', icon: '📁', descKey: 'tool.base64File.desc' },
    ]
  },
  {
    categoryKey: 'category.security',
    items: [
      { nameKey: 'tool.jasypt', path: '/jasypt', icon: '🔐', descKey: 'tool.jasypt.desc' },
      { nameKey: 'tool.hash', path: '/hash', icon: '🔒', descKey: 'tool.hash.desc' },
      { nameKey: 'tool.password', path: '/password', icon: '🔑', descKey: 'tool.password.desc' },
      { nameKey: 'tool.bcrypt', path: '/bcrypt', icon: '🔐', descKey: 'tool.bcrypt.desc' },
      { nameKey: 'tool.hmac', path: '/hmac', icon: '🔒', descKey: 'tool.hmac.desc' },
      { nameKey: 'tool.otp', path: '/otp', icon: '🔢', descKey: 'tool.otp.desc' },
      { nameKey: 'tool.basicAuth', path: '/basic-auth', icon: '🔑', descKey: 'tool.basicAuth.desc' },
      { nameKey: 'tool.stringObfuscator', path: '/string-obfuscator', icon: '🎭', descKey: 'tool.stringObfuscator.desc' },
      { nameKey: 'tool.passwordStrength', path: '/password-strength', icon: '💪', descKey: 'tool.passwordStrength.desc' },
      { nameKey: 'tool.bip39', path: '/bip39', icon: '🔐', descKey: 'tool.bip39.desc' },
    ]
  },
  {
    categoryKey: 'category.dataFormat',
    items: [
      { nameKey: 'tool.json', path: '/json', icon: '📋', descKey: 'tool.json.desc' },
      { nameKey: 'tool.jsonl', path: '/jsonl', icon: '🧾', descKey: 'tool.jsonl.desc' },
      // JSON flatten helps reshape nested payloads into key/value paths.
      { nameKey: 'tool.jsonFlatten', path: '/json-flatten', icon: '🧩', descKey: 'tool.jsonFlatten.desc' },
      { nameKey: 'tool.graphql', path: '/graphql', icon: '🔷', descKey: 'tool.graphql.desc' },
      { nameKey: 'tool.jwt', path: '/jwt', icon: '🎫', descKey: 'tool.jwt.desc' },
      { nameKey: 'tool.sql', path: '/sql', icon: '🗃️', descKey: 'tool.sql.desc' },
      { nameKey: 'tool.mybatis', path: '/mybatis', icon: '🐦', descKey: 'tool.mybatis.desc' },
      { nameKey: 'tool.csv', path: '/csv', icon: '📊', descKey: 'tool.csv.desc' },
      { nameKey: 'tool.html', path: '/html', icon: '🏷️', descKey: 'tool.html.desc' },
      { nameKey: 'tool.yamlJson', path: '/yaml-json', icon: '🔄', descKey: 'tool.yamlJson.desc' },
      { nameKey: 'tool.yamlToml', path: '/yaml-toml', icon: '🔄', descKey: 'tool.yamlToml.desc' },
      { nameKey: 'tool.jsonToml', path: '/json-toml', icon: '🔄', descKey: 'tool.jsonToml.desc' },
      { nameKey: 'tool.xmlJson', path: '/xml-json', icon: '🔄', descKey: 'tool.xmlJson.desc' },
      { nameKey: 'tool.markdownHtml', path: '/markdown-html', icon: '📝', descKey: 'tool.markdownHtml.desc' },
      { nameKey: 'tool.jsonMinify', path: '/json-minify', icon: '📦', descKey: 'tool.jsonMinify.desc' },
      { nameKey: 'tool.jsonCsv', path: '/json-csv', icon: '📊', descKey: 'tool.jsonCsv.desc' },
      { nameKey: 'tool.jsonDiff', path: '/json-diff', icon: '🔍', descKey: 'tool.jsonDiff.desc' },
      // Env diff is useful for comparing deployment configurations.
      { nameKey: 'tool.envDiff', path: '/env-diff', icon: '🧪', descKey: 'tool.envDiff.desc' },
    ]
  },
  {
    categoryKey: 'category.generators',
    items: [
      { nameKey: 'tool.uuid', path: '/uuid', icon: '🆔', descKey: 'tool.uuid.desc' },
      { nameKey: 'tool.qrcode', path: '/qrcode', icon: '📱', descKey: 'tool.qrcode.desc' },
      { nameKey: 'tool.lorem', path: '/lorem', icon: '📄', descKey: 'tool.lorem.desc' },
      { nameKey: 'tool.tokenGenerator', path: '/token-generator', icon: '🎲', descKey: 'tool.tokenGenerator.desc' },
      { nameKey: 'tool.ulid', path: '/ulid', icon: '🆔', descKey: 'tool.ulid.desc' },
      { nameKey: 'tool.portGenerator', path: '/port-generator', icon: '🔌', descKey: 'tool.portGenerator.desc' },
      { nameKey: 'tool.emojiPicker', path: '/emoji-picker', icon: '😀', descKey: 'tool.emojiPicker.desc' },
      { nameKey: 'tool.asciiArt', path: '/ascii-art', icon: '🎨', descKey: 'tool.asciiArt.desc' },
      { nameKey: 'tool.macAddress', path: '/mac-address', icon: '🖧', descKey: 'tool.macAddress.desc' },
    ]
  },
  {
    categoryKey: 'category.converters',
    items: [
      { nameKey: 'tool.timestamp', path: '/timestamp', icon: '⏰', descKey: 'tool.timestamp.desc' },
      { nameKey: 'tool.color', path: '/color', icon: '🎨', descKey: 'tool.color.desc' },
      { nameKey: 'tool.case', path: '/case', icon: '📝', descKey: 'tool.case.desc' },
      { nameKey: 'tool.baseconv', path: '/baseconv', icon: '🔢', descKey: 'tool.baseconv.desc' },
      { nameKey: 'tool.romanNumeral', path: '/roman-numeral', icon: 'Ⅰ', descKey: 'tool.romanNumeral.desc' },
      { nameKey: 'tool.tempConverter', path: '/temp-converter', icon: '🌡️', descKey: 'tool.tempConverter.desc' },
    ]
  },
  {
    categoryKey: 'category.text',
    items: [
      { nameKey: 'tool.slugify', path: '/slugify', icon: '🔗', descKey: 'URL/파일명 안전 문자열 변환' },
      { nameKey: 'tool.slugify', path: '/slugify', icon: '🔗', descKey: 'tool.slugify.desc' },
      { nameKey: 'tool.natoAlphabet', path: '/nato-alphabet', icon: '📻', descKey: 'tool.natoAlphabet.desc' },
      { nameKey: 'tool.textBinary', path: '/text-binary', icon: '0', descKey: 'tool.textBinary.desc' },
      { nameKey: 'tool.textUnicode', path: '/text-unicode', icon: 'U', descKey: 'tool.textUnicode.desc' },
      { nameKey: 'tool.textStats', path: '/text-stats', icon: '📊', descKey: 'tool.textStats.desc' },
      { nameKey: 'tool.numeronym', path: '/numeronym', icon: 'i18n', descKey: 'tool.numeronym.desc' },
      { nameKey: 'tool.listConverter', path: '/list-converter', icon: '📃', descKey: 'tool.listConverter.desc' },
      { nameKey: 'tool.emailNormalizer', path: '/email-normalizer', icon: '📧', descKey: 'tool.emailNormalizer.desc' },
    ]
  },
  {
    categoryKey: 'category.calculators',
    items: [
      { nameKey: 'tool.mathEval', path: '/math-eval', icon: '🧮', descKey: 'tool.mathEval.desc' },
      { nameKey: 'tool.percentageCalc', path: '/percentage-calc', icon: '%', descKey: 'tool.percentageCalc.desc' },
      { nameKey: 'tool.semver', path: '/semver', icon: '🔢', descKey: 'tool.semver.desc' },
    ]
  },
  {
    categoryKey: 'category.info',
    items: [
      { nameKey: 'tool.httpStatus', path: '/http-status', icon: '🌐', descKey: 'HTTP 상태 코드 목록' },
      { nameKey: 'tool.mimeTypes', path: '/mime-types', icon: '📄', descKey: 'tool.mimeTypes.desc' },
      { nameKey: 'tool.keycode', path: '/keycode', icon: '⌨️', descKey: 'tool.keycode.desc' },
      { nameKey: 'tool.deviceInfo', path: '/device-info', icon: '📱', descKey: 'tool.deviceInfo.desc' },
      { nameKey: 'tool.userAgent', path: '/user-agent', icon: '🖥️', descKey: 'tool.userAgent.desc' },
      { nameKey: 'tool.phoneParser', path: '/phone-parser', icon: '📞', descKey: 'tool.phoneParser.desc' },
      { nameKey: 'tool.ibanValidator', path: '/iban-validator', icon: '🏦', descKey: 'tool.ibanValidator.desc' },
    ]
  },
  {
    categoryKey: 'category.linux',
    items: [
      { nameKey: 'tool.chmod', path: '/chmod', icon: '🔐', descKey: 'tool.chmod.desc' },
      { nameKey: 'tool.regex', path: '/regex', icon: '🔍', descKey: 'tool.regex.desc' },
      { nameKey: 'tool.cron', path: '/cron', icon: '⏰', descKey: 'tool.cron.desc' },
    ]
  },
  {
    categoryKey: 'category.network',
    items: [
      { nameKey: 'tool.ipcalc', path: '/ipcalc', icon: '🌐', descKey: 'tool.ipcalc.desc' },
      { nameKey: 'tool.diff', path: '/diff', icon: '📄', descKey: 'tool.diff.desc' },
      { nameKey: 'tool.urlParser', path: '/url-parser', icon: '🔍', descKey: 'tool.urlParser.desc' },
      { nameKey: 'tool.ipv4Converter', path: '/ipv4-converter', icon: '🔢', descKey: 'tool.ipv4Converter.desc' },
      { nameKey: 'tool.httpHeaders', path: '/http-headers', icon: '📨', descKey: 'tool.httpHeaders.desc' },
      // Cookie parsing complements HTTP header inspection.
      { nameKey: 'tool.cookieParser', path: '/cookie-parser', icon: '🍪', descKey: 'tool.cookieParser.desc' },
    ]
  }
]

// Hero card copy is centralized here so each item can be localized through translation keys.
const heroHighlights = [
  { icon: '🔒', titleKey: 'home.hero.cards.privacy.title', descKey: 'home.hero.cards.privacy.desc' },
  { icon: '⚡', titleKey: 'home.hero.cards.instant.title', descKey: 'home.hero.cards.instant.desc' },
  { icon: '💯', titleKey: 'home.hero.cards.free.title', descKey: 'home.hero.cards.free.desc' },
  { icon: '📱', titleKey: 'home.hero.cards.devices.title', descKey: 'home.hero.cards.devices.desc' },
]

export default function Home() {
  const { t } = useLanguage()
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section - 핵심 가치 제안 */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 rounded-2xl shadow-lg p-8 md:p-12 mb-12 border border-blue-100 dark:border-gray-700">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            {t('home.hero.badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {t('home.hero.subtitle')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            {t('home.hero.privacyNote')}
          </p>

          {/* Key Features - 핵심 특징 */}
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            {heroHighlights.map((highlight) => (
              <div
                key={highlight.titleKey}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="text-2xl mb-2">{highlight.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {t(highlight.titleKey)}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t(highlight.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {toolsConfig.map((category) => (
          <div key={category.categoryKey}>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              {t(category.categoryKey)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((tool) => (
                <Link
                  key={tool.path}
                  href={tool.path}
                  className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-3xl">{tool.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                        {t(tool.nameKey)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t(tool.descKey)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {t('nav.snippets')}
            </p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-1">
              {t('home.snippets.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {t('home.snippets.desc')}
            </p>
          </div>
          <Link
            href="/snippets"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('home.snippets.cta')}
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {t('nav.changelog')}
            </p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-1">
              {t('home.changelog.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {t('home.changelog.desc')}
            </p>
          </div>
          <Link
            href="/changelog"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('home.changelog.cta')}
          </Link>
        </div>
      </div>

      {/* 접을 수 있는 소개 섹션 - 맨 아래 */}
      <div className="mt-12">
        <button
          onClick={() => setIsAboutOpen(!isAboutOpen)}
          className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex items-center justify-between"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {t('home.aboutTitle')}
          </h2>
          <svg
            className={`w-6 h-6 text-gray-600 dark:text-gray-400 transition-transform ${
              isAboutOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isAboutOpen && (
          <div className="mt-4 space-y-6">
            {/* 소개 섹션 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed">
                  {t('home.aboutText1')}
                </p>
                <p className="leading-relaxed">
                  {t('home.aboutText2')}
                </p>
              </div>
            </div>

            {/* 주요 특징 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md p-8 border border-blue-200 dark:border-gray-600">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                {t('home.whyTitle')}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {num}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                        {t(`home.feature${num}.title`)}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {t(`home.feature${num}.desc`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
