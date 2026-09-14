'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/lib/cart/CartContext'
import { calculateTax, calculateTotal, formatPrice } from '@/lib/format/currency'
import { validateShipping, type ShippingErrors, type ShippingForm } from '@/lib/checkout/validate'
import styles from './page.module.css'

const EMPTY_FORM: ShippingForm = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  postcode: '',
}

const FIELDS: readonly { name: keyof ShippingForm; label: string; type: string; autoComplete: string }[] = [
  { name: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email' },
  { name: 'address', label: 'Street address', type: 'text', autoComplete: 'street-address' },
]

export default function CheckoutPage() {
  const { state, subtotal, clear, isHydrated } = useCart()
  const [form, setForm] = useState<ShippingForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<ShippingErrors>({})
  const [isPlaced, setIsPlaced] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = validateShipping(form)
    setErrors(result.errors)
    if (!result.isValid) return

    // No payment is taken: this records the order locally and empties the bag.
    clear()
    setIsPlaced(true)
  }

  function update(name: keyof ShippingForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  if (isPlaced) {
    return (
      <div className={`container ${styles.wrap}`}>
        <div className={styles.confirmation}>
          <h1 className={styles.confirmTitle}>Thank you.</h1>
          <p className={styles.confirmCopy}>
            Your order has been recorded. No payment was taken — this store is a demonstration.
          </p>
          <Button href="/store/all" large>
            Continue shopping
          </Button>
        </div>
      </div>
    )
  }

  if (isHydrated && state.lines.length === 0) {
    return (
      <div className={`container ${styles.wrap}`}>
        <h1 className={styles.title}>Your bag is empty.</h1>
        <Button href="/store/all" large>
          Continue shopping
        </Button>
      </div>
    )
  }

  const tax = calculateTax(subtotal)
  const total = calculateTotal(subtotal)

  return (
    <div className={`container ${styles.wrap}`}>
      <h1 className={styles.title}>Check out.</h1>

      <div className={styles.layout}>
        <form onSubmit={handleSubmit} noValidate aria-label="Delivery details">
          <h2 className={styles.label}>Delivery details</h2>

          {FIELDS.map((field) => (
            <div key={field.name} className={styles.field}>
              <label className={styles.label} htmlFor={field.name}>
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                className={styles.input}
                value={form[field.name]}
                onChange={(event) => update(field.name, event.target.value)}
                aria-invalid={Boolean(errors[field.name])}
                aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              />
              {errors[field.name] && (
                <span className={styles.error} id={`${field.name}-error`} role="alert">
                  {errors[field.name]}
                </span>
              )}
            </div>
          ))}

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="city">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                className={styles.input}
                value={form.city}
                onChange={(event) => update('city', event.target.value)}
                aria-invalid={Boolean(errors.city)}
                aria-describedby={errors.city ? 'city-error' : undefined}
              />
              {errors.city && (
                <span className={styles.error} id="city-error" role="alert">
                  {errors.city}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="postcode">
                Postcode
              </label>
              <input
                id="postcode"
                name="postcode"
                type="text"
                autoComplete="postal-code"
                className={styles.input}
                value={form.postcode}
                onChange={(event) => update('postcode', event.target.value)}
                aria-invalid={Boolean(errors.postcode)}
                aria-describedby={errors.postcode ? 'postcode-error' : undefined}
              />
              {errors.postcode && (
                <span className={styles.error} id="postcode-error" role="alert">
                  {errors.postcode}
                </span>
              )}
            </div>
          </div>

          <p className={styles.notice}>
            <strong>Payment is not enabled.</strong> This store is a demonstration build, so no
            card details are requested, transmitted or stored. Wire up your payment provider
            before taking real orders.
          </p>

          <div style={{ marginTop: 'var(--space-5)' }}>
            <Button type="submit" large>
              Place order
            </Button>
          </div>
        </form>

        <aside className={styles.summary} aria-label="Order summary">
          {state.lines.map((line) => (
            <div key={`${line.productId}-${line.variantId}`} className={styles.summaryRow}>
              <span>
                {line.name} × {line.quantity}
              </span>
              <span>{formatPrice(line.unitPrice * line.quantity)}</span>
            </div>
          ))}
          <div className={styles.summaryRow}>
            <span>Delivery</span>
            <span>Free</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Estimated tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
