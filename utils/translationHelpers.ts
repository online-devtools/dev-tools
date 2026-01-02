import { SupportedLanguage } from '@/utils/i18n'
import { translations } from '@/config/translations'

export type TranslationReplacements = Record<string, string | number>

// Return a translated string when available, otherwise null so callers can decide on fallbacks.
export const getTranslationOrNull = (
  language: SupportedLanguage,
  key: string,
): string | null => {
  // Pull from the requested language first, then fall back to English.
  const primary = translations[language]?.[key]
  const fallback = translations.en?.[key]
  return primary ?? fallback ?? null
}

// Return a translated string or the key itself when no translation exists.
export const getTranslationOrKey = (
  language: SupportedLanguage,
  key: string,
): string => {
  // Returning the key keeps UI/metadata stable even with missing translations.
  return getTranslationOrNull(language, key) ?? key
}

// Translate a key and interpolate replacement tokens like {{token}}.
export const translate = (
  language: SupportedLanguage,
  key: string,
  replacements?: TranslationReplacements,
): string => {
  const template = getTranslationOrKey(language, key)
  if (!replacements) {
    return template
  }

  // Replace each token with its stringified value to mirror client-side behavior.
  return Object.entries(replacements).reduce((acc, [token, value]) => {
    const pattern = new RegExp(`{{\\s*${token}\\s*}}`, 'g')
    return acc.replace(pattern, String(value))
  }, template)
}
