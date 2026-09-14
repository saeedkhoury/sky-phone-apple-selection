import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductTile } from '@/components/tiles/ProductTile'
import { TileGrid } from '@/components/tiles/TileGrid'
import { products } from '@/lib/catalog/products'
import { categories } from '@/lib/catalog/categories'
import { filterByCategory, sortProducts } from '@/lib/catalog/query'
import { LOCALES, isLocale, translate } from '@/lib/i18n/config'
import { SHOP } from '@/lib/shop'
import styles from './page.module.css'

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => [
    { locale, category: 'all' },
    ...categories.map((category) => ({ locale, category: category.id })),
  ])
}

export async function generateMetadata({ params }: PageProps<'/[locale]/store/[category]'>) {
  const { locale, category } = await params
  if (!isLocale(locale)) return { title: SHOP.name }

  const match = categories.find((entry) => entry.id === category)
  const label = match ? translate(locale, match.labelKey) : translate(locale, 'nav_products')
  return { title: `${label} — ${SHOP.name}` }
}

export default async function CategoryPage({ params }: PageProps<'/[locale]/store/[category]'>) {
  const { locale, category } = await params
  if (!isLocale(locale)) notFound()

  const match = categories.find((entry) => entry.id === category)
  if (category !== 'all' && !match) notFound()

  const t = (key: string) => translate(locale, key)
  const items = sortProducts(filterByCategory(products, category), 'featured')

  return (
    <>
      <header className={`container ${styles.head}`}>
        <h1 className={styles.title}>
          {match ? t(match.labelKey) : t('nav_products')}
        </h1>
        <p className={styles.tagline}>{t('pr_sub')}</p>
      </header>

      <nav className={`container ${styles.filters}`} aria-label={t('filter_category')}>
        <Link
          href={`/${locale}/store/all`}
          className={styles.chip}
          data-active={category === 'all'}
        >
          {t('filter_all')}
        </Link>
        {categories.map((entry) => (
          <Link
            key={entry.id}
            href={`/${locale}/store/${entry.id}`}
            className={styles.chip}
            data-active={category === entry.id}
          >
            {t(entry.labelKey)}
          </Link>
        ))}
      </nav>

      <section className="container" style={{ paddingBottom: 'var(--space-10)' }}>
        {items.length === 0 ? (
          <p className={styles.empty}>{t('search_empty_p')}</p>
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
