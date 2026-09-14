export interface ShippingForm {
  fullName: string
  email: string
  address: string
  city: string
  postcode: string
}

export type ShippingErrors = Partial<Record<keyof ShippingForm, string>>

export interface ValidationResult {
  isValid: boolean
  errors: ShippingErrors
}

/** Upper bound on any single field, so nothing unbounded reaches storage. */
const MAX_FIELD_LENGTH = 200
const MIN_NAME_LENGTH = 2
const MIN_POSTCODE_LENGTH = 3

/**
 * Deliberately permissive: requires a local part, an "@", and a dotted domain.
 * Stricter patterns reject valid real-world addresses more often than they
 * catch typos.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function isTooLong(value: string): boolean {
  return value.length > MAX_FIELD_LENGTH
}

export function validateShipping(form: ShippingForm): ValidationResult {
  const errors: ShippingErrors = {}

  const fullName = form.fullName.trim()
  if (fullName.length < MIN_NAME_LENGTH) {
    errors.fullName = 'Enter your full name.'
  } else if (isTooLong(fullName)) {
    errors.fullName = 'That name is too long.'
  }

  const email = form.email.trim()
  if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.'
  } else if (isTooLong(email)) {
    errors.email = 'That email address is too long.'
  }

  const address = form.address.trim()
  if (address.length === 0) {
    errors.address = 'Enter your street address.'
  } else if (isTooLong(address)) {
    errors.address = 'That address is too long.'
  }

  const city = form.city.trim()
  if (city.length === 0) {
    errors.city = 'Enter your city.'
  } else if (isTooLong(city)) {
    errors.city = 'That city name is too long.'
  }

  const postcode = form.postcode.trim()
  if (postcode.length < MIN_POSTCODE_LENGTH) {
    errors.postcode = 'Enter a valid postcode.'
  } else if (isTooLong(postcode)) {
    errors.postcode = 'That postcode is too long.'
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}
