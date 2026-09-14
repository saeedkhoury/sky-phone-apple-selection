import { describe, it, expect } from 'vitest'
import { formatPrice, formatPriceFor, orderTotal, VAT_RATE } from './currency'

describe('formatPrice', () => {
  it('formats a price in shekels with a thousands separator', () => {
    expect(formatPrice(4290)).toBe('₪4,290')
  })

  it('formats a small price without a separator', () => {
    expect(formatPrice(120)).toBe('₪120')
  })

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('₪0')
  })

  it('shows no agorot, because the shop prices in whole shekels', () => {
    expect(formatPrice(4290)).not.toContain('.')
  })

  it('throws on a negative amount', () => {
    expect(() => formatPrice(-1)).toThrow(/negative/i)
  })

  it('throws on a fractional amount', () => {
    expect(() => formatPrice(10.5)).toThrow(/whole/i)
  })

  it('throws on a non-finite amount', () => {
    expect(() => formatPrice(Number.NaN)).toThrow(/finite/i)
  })
})

describe('formatPriceFor', () => {
  it('puts the shekel sign before the number in English', () => {
    expect(formatPriceFor('en', 4290)).toBe('₪4,290')
  })

  it('formats Hebrew prices with western digits', () => {
    const result = formatPriceFor('he', 4290)
    expect(result).toContain('4')
    expect(result).toContain('₪')
  })

  it('formats Arabic prices with western digits, as the shop does', () => {
    // Eastern Arabic numerals would not match the shop's own signage.
    const result = formatPriceFor('ar', 4290)
    expect(result).toMatch(/4[,٬]?290/)
  })

  it('rejects invalid amounts in every locale', () => {
    expect(() => formatPriceFor('he', -5)).toThrow()
  })
})

describe('orderTotal', () => {
  it('equals the subtotal, because shelf prices already include VAT', () => {
    expect(orderTotal(4290)).toBe(4290)
  })

  it('is zero for an empty bag', () => {
    expect(orderTotal(0)).toBe(0)
  })

  it('exposes the VAT rate for display purposes only', () => {
    expect(VAT_RATE).toBeGreaterThan(0)
    expect(VAT_RATE).toBeLessThan(1)
  })
})
