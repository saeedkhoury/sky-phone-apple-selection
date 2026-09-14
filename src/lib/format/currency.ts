/**
 * Money is handled in integer cents everywhere in this codebase. Floating point
 * dollars accumulate rounding error across cart lines, so amounts are only
 * converted to a decimal string at the moment they are displayed.
 */

export const TAX_RATE = 0.0825

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function assertValidCents(cents: number, label: string): void {
  if (!Number.isFinite(cents)) {
    throw new TypeError(`${label} must be a finite number, received ${cents}`)
  }
  if (!Number.isInteger(cents)) {
    throw new TypeError(`${label} must be an integer number of cents, received ${cents}`)
  }
  if (cents < 0) {
    throw new RangeError(`${label} must not be negative, received ${cents}`)
  }
}

/** Renders integer cents as a localized currency string, e.g. 129900 -> "$1,299.00". */
export function formatPrice(cents: number): string {
  assertValidCents(cents, 'price')
  return formatter.format(cents / 100)
}

/** Sales tax on a subtotal, rounded to the nearest whole cent. */
export function calculateTax(subtotalCents: number): number {
  assertValidCents(subtotalCents, 'subtotal')
  return Math.round(subtotalCents * TAX_RATE)
}

/** Order total: subtotal plus tax. Shipping is free in this store. */
export function calculateTotal(subtotalCents: number): number {
  return subtotalCents + calculateTax(subtotalCents)
}
