import en from './messages/en.json'
import he from './messages/he.json'
import ar from './messages/ar.json'

export const LOCALES = ['he', 'ar', 'en'] as const
export type Locale = (typeof LOCALES)[number]

/** Hebrew first: it is the shop's primary customer language. */
export const DEFAULT_LOCALE: Locale = 'he'

export type Direction = 'rtl' | 'ltr'

const DIRECTIONS: Record<Locale, Direction> = {
  he: 'rtl',
  ar: 'rtl',
  en: 'ltr',
}

export const LOCALE_NAMES: Record<Locale, string> = {
  he: 'עברית',
  ar: 'العربية',
  en: 'English',
}

/** `lang` attribute values, which are not always the same as our locale codes. */
export const LOCALE_TAGS: Record<Locale, string> = {
  he: 'he-IL',
  ar: 'ar',
  en: 'en',
}

/** The English deck is the reference: every key exists in all three locales. */
export type MessageKey = keyof typeof en

const MESSAGES: Record<Locale, Record<string, string>> = { he, ar, en }

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

export function directionFor(locale: Locale): Direction {
  return DIRECTIONS[locale]
}

export function isRtl(locale: Locale): boolean {
  return directionFor(locale) === 'rtl'
}

export function getMessages(locale: Locale): Record<string, string> {
  return MESSAGES[locale]
}

/**
 * Looks up a translation. Falls back to English and then to the key itself, so
 * a missing string degrades to something readable rather than blank — but the
 * generator checks for gaps, so this should never fire in practice.
 */
export function translate(locale: Locale, key: MessageKey | string): string {
  return MESSAGES[locale][key] ?? MESSAGES.en[key] ?? String(key)
}

export type Translator = (key: MessageKey | string) => string

export function translatorFor(locale: Locale): Translator {
  return (key) => translate(locale, key)
}
