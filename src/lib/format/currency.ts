import type { Locale } from '@/lib/i18n/config'

/**
 * Money is handled in whole Israeli shekels. The shop prices in round shekels —
 * there are no agorot on its shelves — so there is no minor unit to carry and
 * no rounding to accumulate.
 *
 * Israeli consumer prices are VAT-inclusive by law, so there is deliberately no
 * "add tax at checkout" step: the shelf price is the price paid. VAT_RATE is
 * exported only so the bag can state that VAT is already included.
 */

export const VAT_RATE = 0.18

const LOCALE_TAGS: Record<Locale, string> = {
  he: 'he-IL',
  ar: 'ar-EG',
  en: 'en-IL',
}

function assertValidAmount(amount: number): void {
  if (!Number.isFinite(amount)) {
    throw new TypeError(`price must be a finite number, received ${amount}`)
  }
  if (!Number.isInteger(amount)) {
    throw new TypeError(`price must be a whole number of shekels, received ${amount}`)
  }
  if (amount < 0) {
    throw new RangeError(`price must not be negative, received ${amount}`)
  }
}

function buildFormatter(tag: string): Intl.NumberFormat {
  return new Intl.NumberFormat(tag, {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    // Western digits in every locale: they match the shop's own signage and
    // receipts, and Arabic-Indic digits here would read as a bug to the owner.
    numberingSystem: 'latn',
  })
}

const formatters: Partial<Record<Locale, Intl.NumberFormat>> = {}
const defaultFormatter = buildFormatter('en-IL')

/** Formats using the shop's default presentation. */
export function formatPrice(amount: number): string {
  assertValidAmount(amount)
  return defaultFormatter.format(amount)
}

/** Formats for a specific locale, so the currency sign sits correctly for RTL. */
export function formatPriceFor(locale: Locale, amount: number): string {
  assertValidAmount(amount)
  formatters[locale] ??= buildFormatter(LOCALE_TAGS[locale])
  return formatters[locale]!.format(amount)
}

/**
 * The order total. Equal to the subtotal by design: prices include VAT and the
 * shop does not charge for local delivery.
 */
export function orderTotal(subtotal: number): number {
  assertValidAmount(subtotal)
  return subtotal
}
