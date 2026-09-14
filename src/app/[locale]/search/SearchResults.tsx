'use client'

import { useSearchParams } from 'next/navigation'
import { ProductTile } from '@/components/tiles/ProductTile'
import { TileGrid } from '@/components/tiles/TileGrid'
import { products } from '@/lib/catalog/products'
import { searchProducts } from '@/lib/catalog/query'
import { translate, type Locale } from '@/lib/i18n/config'
import styles from './page.module.css'

export function SearchResults({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const t = (key: string) => translate(locale, key)
  const results = searchProducts(products, query, locale)

  return (
    <div className={`container ${styles.wrap}`}>
      <h1 className={styles.title}>{query ? `“${query}”` : t('search_ph')}</h1>
      <p className={styles.meta}>{results.length}</p>

      {results.length === 0 ? (
        <p className={styles.empty}>{t('search_empty_p')}</p>
      ) : (
        <TileGrid columns={3}>
          {results.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </TileGrid>
      )}
    </div>
  )
}
