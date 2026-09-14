import { describe, it, expect } from 'vitest'
import { formatPrice, calculateTax, calculateTotal, TAX_RATE } from './currency'

describe('formatPrice', () => {
  it('formats a whole-dollar amount with two decimals', () => {
    expect(formatPrice(129900)).toBe('$1,299.00')
  })

  it('formats an amount with cents', () => {
    expect(formatPrice(4999)).toBe('$49.99')
  })

  it('formats zero as $0.00', () => {
    expect(formatPrice(0)).toBe('$0.00')
  })

  it('throws when given a negative amount', () => {
    expect(() => formatPrice(-1)).toThrow(/negative/i)
  })

  it('throws when given a non-integer number of cents', () => {
    expect(() => formatPrice(10.5)).toThrow(/integer/i)
  })

  it('throws when given a non-finite value', () => {
    expect(() => formatPrice(Number.NaN)).toThrow(/finite/i)
  })
})

describe('calculateTax', () => {
  it('applies the tax rate and rounds to the nearest cent', () => {
    // 10000 cents * 0.0825 = 825 cents exactly
    expect(calculateTax(10000)).toBe(Math.round(10000 * TAX_RATE))
  })

  it('returns zero tax on a zero subtotal', () => {
    expect(calculateTax(0)).toBe(0)
  })

  it('never returns a fractional number of cents', () => {
    expect(Number.isInteger(calculateTax(3333))).toBe(true)
  })

  it('throws on a negative subtotal', () => {
    expect(() => calculateTax(-100)).toThrow(/negative/i)
  })
})

describe('calculateTotal', () => {
  it('adds tax to the subtotal', () => {
    const subtotal = 10000
    expect(calculateTotal(subtotal)).toBe(subtotal + calculateTax(subtotal))
  })

  it('returns zero for an empty basket', () => {
    expect(calculateTotal(0)).toBe(0)
  })
})
