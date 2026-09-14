import Link from 'next/link'
import { formatPrice } from '@/lib/format/currency'
import type { Product } from '@/lib/catalog/types'
import styles from './ProductTile.module.css'

export function ProductTile({ product }: { product: Product }) {
  const base = product.variants[0]

  return (
    <Link href={`/product/${product.slug}`} className={styles.tile}>
      <div
        className={styles.art}
        style={{ background: `radial-gradient(120% 90% at 50% 0%, ${base.swatch}33, transparent)` }}
      >
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
        <span
          className={styles.artShape}
          style={{ background: `linear-gradient(155deg, ${base.swatch}, ${base.swatch}88)` }}
          aria-hidden="true"
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.tagline}>{product.tagline}</p>
        <p className={styles.price}>From {formatPrice(base.price)}</p>
      </div>
    </Link>
  )
}
