'use client'

import DiffTool from '@/components/DiffTool'
import { useLanguage } from '@/contexts/LanguageContext'

// 리스트형 데이터는 별도 배열로 분리해 번역 키만 순회합니다.
const whenItems = [
  'diffPage.when.item.codeReview',
  'diffPage.when.item.config',
  'diffPage.when.item.docs',
  'diffPage.when.item.api',
  'diffPage.when.item.migration',
  'diffPage.when.item.merge',
]

const cautionItems = [
  'diffPage.caution.space',
  'diffPage.caution.newline',
  'diffPage.caution.large',
  'diffPage.caution.binary',
  'diffPage.caution.encoding',
]

const algorithms = [
  'diffPage.alg.myers',
  'diffPage.alg.patience',
  'diffPage.alg.histogram',
  'diffPage.alg.word',
]

export default function DiffContent() {
  const { t } = useLanguage()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <DiffTool />

      {/* 심화 콘텐츠 섹션: 모든 텍스트를 번역 키로 렌더링합니다. */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {t('diffPage.hero.title')}
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              {t('diffPage.why.title')}
            </h3>
            <p className="leading-relaxed mb-3">
              {t('diffPage.why.p1')}
            </p>
            <p className="leading-relaxed">
              {t('diffPage.why.p2')}
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              {t('diffPage.when.title')}
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {whenItems.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              {t('diffPage.examples.title')}
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">{t('diffPage.examples.example1.title')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="mb-2 font-semibold">{t('diffPage.examples.example1.dev')}</p>
                    <code className="bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                      {`{
  "database": "dev_db",
  "port": 3000,
  "debug": true
}`}
                    </code>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold">{t('diffPage.examples.example1.prod')}</p>
                    <code className="bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                      {`{
  "database": "prod_db",
  "port": 8080,
  "debug": false
}`}
                    </code>
                  </div>
                </div>
                <p className="text-sm mt-2">{t('diffPage.examples.example1.diff')}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm mb-2 font-semibold">{t('diffPage.examples.example2.title')}</p>
                <code className="text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded block overflow-x-auto">
                  <span className="text-red-600">- function calculateTotal(items) {'{'}</span><br />
                  <span className="text-green-600">+ function calculateTotal(items, discount = 0) {'{'}</span><br />
                  &nbsp;&nbsp;let total = items.reduce((sum, item) =&gt; sum + item.price, 0)<br />
                  <span className="text-green-600">+  total = total * (1 - discount)</span><br />
                  &nbsp;&nbsp;return total<br />
                  {'}'}
                </code>
                <p className="text-sm mt-2">{t('diffPage.examples.example2.diff')}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              {t('diffPage.repr.title')}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">{t('diffPage.repr.header.display')}</th>
                    <th className="px-4 py-2 text-left border-b">{t('diffPage.repr.header.meaning')}</th>
                    <th className="px-4 py-2 text-left border-b">{t('diffPage.repr.header.desc')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b"><span className="text-green-600">{t('diffPage.repr.row.added.display')}</span></td>
                    <td className="px-4 py-2 border-b">{t('diffPage.repr.row.added.meaning')}</td>
                    <td className="px-4 py-2 border-b">{t('diffPage.repr.row.added.desc')}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b"><span className="text-red-600">{t('diffPage.repr.row.deleted.display')}</span></td>
                    <td className="px-4 py-2 border-b">{t('diffPage.repr.row.deleted.meaning')}</td>
                    <td className="px-4 py-2 border-b">{t('diffPage.repr.row.deleted.desc')}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b"><span className="text-blue-600">{t('diffPage.repr.row.modified.display')}</span></td>
                    <td className="px-4 py-2 border-b">{t('diffPage.repr.row.modified.meaning')}</td>
                    <td className="px-4 py-2 border-b">{t('diffPage.repr.row.modified.desc')}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">&nbsp; {t('diffPage.repr.row.same.display')}</td>
                    <td className="px-4 py-2">{t('diffPage.repr.row.same.meaning')}</td>
                    <td className="px-4 py-2">{t('diffPage.repr.row.same.desc')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              {t('diffPage.caution.title')}
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-sm">
                {cautionItems.map((key) => (
                  <li key={key}>{t(key)}</li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              {t('diffPage.alg.title')}
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm mb-3">{t('diffPage.alg.desc')}</p>
              <ul className="text-sm space-y-2">
                {algorithms.map((key) => (
                  <li key={key}>• {t(key)}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              {t('diffPage.more.title')}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/json" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">{t('diffPage.more.json.title')}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{t('diffPage.more.json.desc')}</p>
              </a>
              <a href="/html" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">{t('diffPage.more.html.title')}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{t('diffPage.more.html.desc')}</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
