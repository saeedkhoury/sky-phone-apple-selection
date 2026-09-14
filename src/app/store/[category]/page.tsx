import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProductTile } from '@/components/tiles/ProductTile'
import { TileGrid } from '@/components/tiles/TileGrid'
import { categories, products } from '@/lib/catalog/products'
import { filterByCategory, sortProducts } from '@/lib/catalog/query'
import styles from './page.module.css'

export function generateStaticParams() {
  return [{ category: 'all' }, ...categories.map((c) => ({ category: c.id }))]
}

export async function generateMetadata({ params }: PageProps<'/store/[category]'>) {
  const { category } = await params
  const match = categories.find((entry) => entry.id === category)
  return { title: match ? `${match.name} — Axiom Store` : 'Store — Axiom Store' }
}

export default async function CategoryPage({ params }: PageProps<'/store/[category]'>) {
  const { category } = await params
  const match = categories.find((entry) => entry.id === category)

  if (category !== 'all' && !match) notFound()

  const items = sortProducts(filterByCategory(products, category), 'featured')

  return (
    <>
      <header className={`container ${styles.head}`}>
        <h1 className={styles.title}>{match ? match.name : 'All products'}</h1>
        <p className={styles.tagline}>
          {match ? match.tagline : 'Every product Axiom makes, in one place.'}
        </p>
      </header>

      <nav className={`container ${styles.filters}`} aria-label="Product categories">
        <Link href="/store/all" className={styles.chip} data-active={category === 'all'}>
          All
        </Link>
        {categories.map((entry) => (
          <Link
            key={entry.id}
            href={`/store/${entry.id}`}
            className={styles.chip}
            data-active={category === entry.id}
          >
            {entry.name}
          </Link>
        ))}
      </nav>

      <section className="container" style={{ paddingBottom: 'var(--space-10)' }}>
        {items.length === 0 ? (
          <p className={styles.empty}>Nothing in this category yet.</p>
        ) : (
          <TileGrid columns={3}>
            {items.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </TileGrid>
        )}
      </section>
    </>
  )
}
