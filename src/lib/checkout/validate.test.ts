import { describe, it, expect } from 'vitest'
import { validateShipping, type ShippingForm } from './validate'

const valid: ShippingForm = {
  fullName: 'Saeed Khoury',
  email: 'saeed@example.com',
  address: '14 Harbour Row',
  city: 'Haifa',
  postcode: '3100201',
}

describe('validateShipping', () => {
  it('accepts a fully completed form', () => {
    const result = validateShipping(valid)
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('rejects an empty full name', () => {
    const result = validateShipping({ ...valid, fullName: '' })
    expect(result.isValid).toBe(false)
    expect(result.errors.fullName).toMatch(/name/i)
  })

  it('rejects a whitespace-only full name', () => {
    expect(validateShipping({ ...valid, fullName: '   ' }).isValid).toBe(false)
  })

  it('rejects a name that is a single character', () => {
    expect(validateShipping({ ...valid, fullName: 'S' }).isValid).toBe(false)
  })

  it('rejects an email with no @', () => {
    const result = validateShipping({ ...valid, email: 'not-an-email' })
    expect(result.errors.email).toMatch(/email/i)
  })

  it('rejects an email with no domain dot', () => {
    expect(validateShipping({ ...valid, email: 'a@b' }).isValid).toBe(false)
  })

  it('accepts an email with a subdomain', () => {
    expect(validateShipping({ ...valid, email: 'a@mail.example.co.uk' }).isValid).toBe(true)
  })

  it('rejects a missing address', () => {
    expect(validateShipping({ ...valid, address: '' }).errors.address).toBeDefined()
  })

  it('rejects a missing city', () => {
    expect(validateShipping({ ...valid, city: '' }).errors.city).toBeDefined()
  })

  it('rejects a postcode that is too short', () => {
    expect(validateShipping({ ...valid, postcode: '12' }).errors.postcode).toBeDefined()
  })

  it('reports every invalid field at once rather than stopping at the first', () => {
    const result = validateShipping({
      fullName: '',
      email: 'bad',
      address: '',
      city: '',
      postcode: '',
    })
    expect(Object.keys(result.errors)).toHaveLength(5)
  })

  it('trims surrounding whitespace before validating', () => {
    expect(validateShipping({ ...valid, email: '  saeed@example.com  ' }).isValid).toBe(true)
  })

  it('rejects an over-long field to bound stored input', () => {
    expect(validateShipping({ ...valid, city: 'x'.repeat(300) }).isValid).toBe(false)
  })
})
