import { notFound } from 'next/navigation'
import { ProductTile } from '@/components/tiles/ProductTile'
import { TileGrid } from '@/components/tiles/TileGrid'
import { products } from '@/lib/catalog/products'
import { searchProducts } from '@/lib/catalog/query'
import { isLocale, translate } from '@/lib/i18n/config'
import { SHOP } from '@/lib/shop'
import styles from './page.module.css'

export const metadata = { title: `${SHOP.name}` }

export default async function SearchPage({
  params,
  searchParams,
}: PageProps<'/[locale]/search'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const resolved = await searchParams
  const raw = resolved.q
  const query = typeof raw === 'string' ? raw : ''
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
