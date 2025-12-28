import { describe, expect, it } from 'vitest'
import {
  buildLocalizedPathname,
  getLanguageFromPathname,
  pickPreferredLanguage,
  stripLanguageFromPathname,
} from '@/utils/i18n'

// i18n utilities should normalize locale prefixes and pick preferred languages reliably.
describe('i18n utilities', () => {
  it('detects language prefixes in pathnames', () => {
    // The first segment should be parsed as a supported language when present.
    expect(getLanguageFromPathname('/ko/base64')).toBe('ko')
    expect(getLanguageFromPathname('/en')).toBe('en')
    expect(getLanguageFromPathname('/ja')).toBe('ja')
    expect(getLanguageFromPathname('/pt')).toBe('pt')
    expect(getLanguageFromPathname('/de/tools')).toBe('de')
    expect(getLanguageFromPathname('/base64')).toBeNull()
  })

  it('strips locale prefixes from pathnames', () => {
    // Locale prefixes should be removed so routes map to existing pages.
    expect(stripLanguageFromPathname('/ko/base64')).toEqual({
      language: 'ko',
      pathname: '/base64',
    })
    expect(stripLanguageFromPathname('/en')).toEqual({
      language: 'en',
      pathname: '/',
    })
    expect(stripLanguageFromPathname('/ja/faq')).toEqual({
      language: 'ja',
      pathname: '/faq',
    })
    expect(stripLanguageFromPathname('/url')).toEqual({
      language: null,
      pathname: '/url',
    })
  })

  it('builds localized pathnames', () => {
    // Paths should be prefixed with the target language and avoid duplicates.
    expect(buildLocalizedPathname('/base64', 'ko')).toBe('/ko/base64')
    expect(buildLocalizedPathname('/en/base64', 'en')).toBe('/en/base64')
    expect(buildLocalizedPathname('/faq', 'ja')).toBe('/ja/faq')
    expect(buildLocalizedPathname('/de/base64', 'de')).toBe('/de/base64')
    expect(buildLocalizedPathname('/', 'en')).toBe('/en')
  })

  it('picks preferred language from Accept-Language', () => {
    // The highest-priority supported language should be selected.
    expect(pickPreferredLanguage('en-US,en;q=0.9,ko;q=0.8')).toBe('en')
    expect(pickPreferredLanguage('fr-CA,ko;q=0.9')).toBe('ko')
    expect(pickPreferredLanguage('ja-JP,ja;q=0.9')).toBe('ja')
    expect(pickPreferredLanguage('pt-BR,pt;q=0.9')).toBe('pt')
    expect(pickPreferredLanguage('de-DE,de;q=0.8,en;q=0.7')).toBe('de')
    expect(pickPreferredLanguage('')).toBe('ko')
  })
})
