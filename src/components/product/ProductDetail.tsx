'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ProductArt } from './ProductArt'
import { useCart } from '@/lib/cart/CartContext'
import { formatPrice } from '@/lib/format/currency'
import type { Product } from '@/lib/catalog/types'
import styles from './ProductDetail.module.css'

export function ProductDetail({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0].id)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem } = useCart()

  const selected = product.variants.find((v) => v.id === variantId) ?? product.variants[0]

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        variantId: selected.id,
        name: product.name,
        variantName: selected.name,
        unitPrice: selected.price,
        slug: product.slug,
      },
      1,
    )
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 2600)
  }

  return (
    <div className={`container ${styles.layout}`}>
      <div
        className={styles.gallery}
        style={{
          background: `radial-gradient(80% 70% at 50% 35%, ${selected.swatch}44, var(--bg-main))`,
        }}
      >
        <ProductArt
          categoryId={product.categoryId}
          swatch={selected.swatch}
          className={styles.galleryShape}
        />
      </div>

      <div>
        {product.badge && <p className={styles.badge}>{product.badge}</p>}
        <h1 className={styles.title}>{product.name}</h1>
        <p className={styles.tagline}>{product.tagline}</p>
        <p className={styles.description}>{product.description}</p>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Choose your configuration</legend>
          <div className={styles.variants}>
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                className={styles.variant}
                aria-pressed={variant.id === selected.id}
                onClick={() => setVariantId(variant.id)}
              >
                <span
                  className={styles.swatch}
                  style={{ backgroundColor: variant.swatch }}
                  aria-hidden="true"
                />
                {variant.name}
                <span className={styles.variantPrice}>{formatPrice(variant.price)}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className={styles.buyRow}>
          <span className={styles.price}>{formatPrice(selected.price)}</span>
          <Button onClick={handleAdd} large>
            Add to Bag
          </Button>
          {justAdded && (
            <span className={styles.added} role="status">
              Added to your bag
            </span>
          )}
        </div>

        <p className={styles.note}>Free delivery · 30-day returns · 2-year warranty</p>

        <section className={styles.specs} aria-label="Technical specifications">
          {product.specs.map((spec) => (
            <div key={spec.label} className={styles.specRow}>
              <span className={styles.specLabel}>{spec.label}</span>
              <span>{spec.value}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
