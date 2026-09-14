'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from '@/lib/i18n/LocaleContext'
import { formatPriceFor } from '@/lib/format/currency'
import type { Product } from '@/lib/catalog/types'
import styles from './ProductTile.module.css'

export function ProductTile({ product }: { product: Product }) {
  const { locale, t } = useLocale()

  return (
    <Link href={`/${locale}/product/${product.slug}`} className={styles.tile}>
      <div className={styles.art}>
        {product.badge && (
          <span className={styles.badge} data-badge={product.badge}>
            {t(product.badge === 'new' ? 'new' : 'instock_badge')}
          </span>
        )}
        <div className={styles.media}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={styles.photo}
            sizes="(max-width: 734px) 90vw, (max-width: 1068px) 45vw, 320px"
          />
        </div>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.tagline}>{product.description[locale]}</p>
        <p className={styles.price}>{formatPriceFor(locale, product.price)}</p>
      </div>
    </Link>
  )
}
