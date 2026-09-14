import { ProductTile } from '@/components/tiles/ProductTile'
import { TileGrid } from '@/components/tiles/TileGrid'
import { products } from '@/lib/catalog/products'
import { searchProducts } from '@/lib/catalog/query'
import styles from './page.module.css'

export const metadata = { title: 'Search — Axiom Store' }

export default async function SearchPage({ searchParams }: PageProps<'/search'>) {
  const params = await searchParams
  const raw = params.q
  const query = typeof raw === 'string' ? raw : ''
  const results = searchProducts(products, query)

  return (
    <div className={`container ${styles.wrap}`}>
      <h1 className={styles.title}>{query ? `Results for “${query}”` : 'Search'}</h1>
      <p className={styles.meta}>
        {results.length} product{results.length === 1 ? '' : 's'}
      </p>

      {results.length === 0 ? (
        <p className={styles.empty}>No products matched that search. Try a broader term.</p>
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
