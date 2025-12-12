'use client'

import { useLanguage } from '@/contexts/LanguageContext'

// Inquiry type cards are driven by translation keys so the layout stays the same across languages.
const inquiryTypes = [
  { icon: '🐛', titleKey: 'contact.inquiryTypes.bug.title', descKey: 'contact.inquiryTypes.bug.desc' },
  { icon: '💡', titleKey: 'contact.inquiryTypes.tool.title', descKey: 'contact.inquiryTypes.tool.desc' },
  { icon: '✨', titleKey: 'contact.inquiryTypes.feature.title', descKey: 'contact.inquiryTypes.feature.desc' },
  { icon: '❓', titleKey: 'contact.inquiryTypes.general.title', descKey: 'contact.inquiryTypes.general.desc' },
]

// FAQ entries stay in data so we only swap the localized copy via translation keys.
const faqItems = [
  { questionKey: 'contact.faq.q1', answerKey: 'contact.faq.a1' },
  { questionKey: 'contact.faq.q2', answerKey: 'contact.faq.a2' },
  { questionKey: 'contact.faq.q3', answerKey: 'contact.faq.a3' },
  { questionKey: 'contact.faq.q4', answerKey: 'contact.faq.a4' },
  { questionKey: 'contact.faq.q5', answerKey: 'contact.faq.a5' },
]

// Checklist bullets capture the data we need from users when debugging issues.
const bugChecklist = [
  'contact.checklist.item.browser',
  'contact.checklist.item.device',
  'contact.checklist.item.screenshot',
  'contact.checklist.item.payload',
  'contact.checklist.item.steps',
]

export default function ContactContent() {
  // Pulls the translator so every heading and bullet respects the selected language.
  const { t } = useLanguage()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          {t('contact.title')}
        </h1>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <p className="leading-relaxed text-lg">
              {t('contact.intro')}
            </p>
          </section>

          <section className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              {t('contact.email.title')}
            </h2>
            <p className="leading-relaxed mb-2">
              {t('contact.email.prompt')}
            </p>
            <p className="text-xl font-mono text-blue-600 dark:text-blue-400">
              {t('contact.email.address')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              {t('contact.email.responseTime')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              {t('contact.inquiryTypes.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {inquiryTypes.map((item) => (
                <div key={item.titleKey} className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <span className="mr-2">{item.icon}</span>
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-sm">
                    {t(item.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              {t('contact.checklist.title')}
            </h2>
            <div className="space-y-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="font-semibold">{t('contact.checklist.description')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {bugChecklist.map((itemKey) => (
                  <li key={itemKey}>{t(itemKey)}</li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              {t('contact.privacy.title')}
            </h2>
            <p className="leading-relaxed">
              {t('contact.privacy.text')}
            </p>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              {t('contact.faq.title')}
            </h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.questionKey}>
                  <h3 className="font-semibold mb-1">{t(item.questionKey)}</h3>
                  <p className="text-sm">
                    {t(item.answerKey)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="font-semibold text-lg mb-2">{t('contact.thanks.title')}</h3>
            <p className="leading-relaxed">
              {t('contact.thanks.text')}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
