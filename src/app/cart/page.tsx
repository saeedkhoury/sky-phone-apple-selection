'use client'

import { Button } from '@/components/ui/Button'
import { ProductArt } from '@/components/product/ProductArt'
import { getProductBySlug } from '@/lib/catalog/query'
import { useCart } from '@/lib/cart/CartContext'
import { MAX_LINE_QUANTITY } from '@/lib/cart/reducer'
import { calculateTax, calculateTotal, formatPrice } from '@/lib/format/currency'
import styles from './page.module.css'

/** Cart lines store a price snapshot, not a colour, so look the swatch up. */
function variantSwatch(slug: string, variantId: string): string {
  const product = getProductBySlug(slug)
  const variant = product?.variants.find((entry) => entry.id === variantId)
  return variant?.swatch ?? '#3a3a3e'
}

export default function CartPage() {
  const { state, subtotal, setQuantity, removeItem, isHydrated } = useCart()

  // Until localStorage is read, render the shell rather than a wrong empty state.
  if (!isHydrated) {
    return (
      <div className={`container ${styles.wrap}`}>
        <h1 className={styles.title}>Your bag</h1>
      </div>
    )
  }

  if (state.lines.length === 0) {
    return (
      <div className={`container ${styles.wrap}`}>
        <h1 className={styles.title}>Your bag is empty.</h1>
        <div className={styles.empty}>
          <p className={styles.emptyCopy}>Nothing here yet — have a look around.</p>
          <Button href="/store/all" large>
            Continue shopping
          </Button>
        </div>
      </div>
    )
  }

  const tax = calculateTax(subtotal)
  const total = calculateTotal(subtotal)

  return (
    <div className={`container ${styles.wrap}`}>
      <h1 className={styles.title}>Your bag.</h1>

      <div className={styles.layout}>
        <section aria-label="Bag items">
          {state.lines.map((line) => (
            <div key={`${line.productId}-${line.variantId}`} className={styles.line}>
              <ProductArt
                categoryId={getProductBySlug(line.slug)?.categoryId ?? 'accessories'}
                swatch={variantSwatch(line.slug, line.variantId)}
                className={styles.thumb}
              />

              <div>
                <h2 className={styles.name}>{line.name}</h2>
                <p className={styles.variant}>{line.variantName}</p>
                <div className={styles.controls}>
                  <label className="visually-hidden" htmlFor={`qty-${line.variantId}`}>
                    Quantity for {line.name}
                  </label>
                  <select
                    id={`qty-${line.variantId}`}
                    className={styles.qtySelect}
                    value={line.quantity}
                    onChange={(event) =>
                      setQuantity(line.productId, line.variantId, Number(event.target.value))
                    }
                  >
                    {Array.from({ length: MAX_LINE_QUANTITY }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => removeItem(line.productId, line.variantId)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <p className={styles.linePrice}>{formatPrice(line.unitPrice * line.quantity)}</p>
            </div>
          ))}
        </section>

        <aside className={styles.summary} aria-label="Order summary">
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
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
          <div className={styles.checkoutButton}>
            <Button href="/checkout" block large>
              Check out
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
