'use client'

import Image from 'next/image'
import { assetPath } from '@/lib/asset-path'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/lib/cart/CartContext'
import { useLocale } from '@/lib/i18n/LocaleContext'
import { MAX_LINE_QUANTITY } from '@/lib/cart/reducer'
import { formatPriceFor, orderTotal } from '@/lib/format/currency'
import { getProductBySlug } from '@/lib/catalog/query'
import { whatsappLink, SHOP } from '@/lib/shop'
import styles from './page.module.css'

export default function CartPage() {
  const { state, subtotal, setQuantity, removeItem, isHydrated } = useCart()
  const { locale, t } = useLocale()

  if (!isHydrated) {
    return (
      <div className={`container ${styles.wrap}`}>
        <h1 className={styles.title}>{t('bag_title')}</h1>
      </div>
    )
  }

  if (state.lines.length === 0) {
    return (
      <div className={`container ${styles.wrap}`}>
        <h1 className={styles.title}>{t('bag_empty_h')}</h1>
        <div className={styles.empty}>
          <p className={styles.emptyCopy}>{t('bag_empty_p')}</p>
          <Button href={`/${locale}/store/all`} large>
            {t('bag_empty_cta')}
          </Button>
        </div>
      </div>
    )
  }

  const total = orderTotal(subtotal)

  /**
   * The shop confirms orders over WhatsApp and takes payment in store — that is
   * how it really works, so the bag composes a real message rather than
   * pretending to process a card.
   */
  const orderMessage = [
    t('wa_order_head'),
    ...state.lines.map(
      (line) =>
        `• ${line.name} — ${line.variantName} × ${line.quantity} — ${formatPriceFor(
          locale,
          line.unitPrice * line.quantity,
        )}`,
    ),
    `${t('bag_total')}: ${formatPriceFor(locale, total)}`,
  ].join('\n')

  return (
    <div className={`container ${styles.wrap}`}>
      <h1 className={styles.title}>{t('bag_title')}</h1>
      <p className={styles.sub}>{t('bag_sub')}</p>

      <div className={styles.layout}>
        <section aria-label={t('bag_title')}>
          {state.lines.map((line) => {
            const product = getProductBySlug(line.slug)
            return (
              <div key={`${line.productId}-${line.variantId}`} className={styles.line}>
                {product && (
                  <Image
                    src={assetPath(product.image)}
                    alt=""
                    width={88}
                    height={88}
                    className={styles.thumb}
                  />
                )}

                <div>
                  <h2 className={styles.name}>{line.name}</h2>
                  <p className={styles.variant}>{line.variantName}</p>
                  <div className={styles.controls}>
                    <label
                      className="visually-hidden"
                      htmlFor={`qty-${line.productId}-${line.variantId}`}
                    >
                      {t('pdp_qty')} — {line.name}
                    </label>
                    <select
                      id={`qty-${line.productId}-${line.variantId}`}
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
                      {t('bag_remove')}
                    </button>
                  </div>
                </div>

                <p className={styles.linePrice}>
                  {formatPriceFor(locale, line.unitPrice * line.quantity)}
                </p>
              </div>
            )
          })}
        </section>

        <aside className={styles.summary} aria-label={t('bag_total')}>
          <div className={styles.summaryRow}>
            <span>{t('bag_subtotal')}</span>
            <span>{formatPriceFor(locale, subtotal)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>{t('bag_ship')}</span>
            <span>{t('bag_ship_v')}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>{t('bag_total')}</span>
            <span>{formatPriceFor(locale, total)}</span>
          </div>

          <div className={styles.checkoutButton}>
            <Button href={whatsappLink(orderMessage)} block large>
              {t('bag_checkout')}
            </Button>
          </div>

          <p className={styles.note}>{t('chat_a_payment')}</p>
          <p className={styles.note}>{SHOP.phone}</p>
        </aside>
      </div>
    </div>
  )
}
