import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductTile } from '@/components/tiles/ProductTile'
import { TileGrid } from '@/components/tiles/TileGrid'
import { products } from '@/lib/catalog/products'
import { brands, categories } from '@/lib/catalog/categories'
import { filterByBrand, filterByCategory, sortProducts } from '@/lib/catalog/query'
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

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps<'/[locale]/store/[category]'>) {
  const { locale, category } = await params
  if (!isLocale(locale)) notFound()

  const match = categories.find((entry) => entry.id === category)
  if (category !== 'all' && !match) notFound()

  const resolved = await searchParams
  const rawBrand = resolved.brand
  const activeBrand = typeof rawBrand === 'string' ? rawBrand : 'all'

  const t = (key: string) => translate(locale, key)

  const inCategory = filterByCategory(products, category)
  const items = sortProducts(filterByBrand(inCategory, activeBrand), 'featured')

  // Only offer brands that actually have stock in this category, so the filter
  // row can never lead to an empty result.
  const availableBrands = brands.filter((brand) =>
    inCategory.some((product) => product.brand === brand.id),
  )

  function hrefFor(nextCategory: string, nextBrand: string): string {
    const base = `/${locale}/store/${nextCategory}`
    return nextBrand === 'all' ? base : `${base}?brand=${nextBrand}`
  }

  const activeBrandName = brands.find((brand) => brand.id === activeBrand)?.name

  return (
    <>
      <header className={`container ${styles.head}`}>
        <h1 className={styles.title}>
          {activeBrandName ? `${activeBrandName} ` : ''}
          {match ? t(match.labelKey) : t('nav_products')}
        </h1>
        <p className={styles.tagline}>{t('pr_sub')}</p>
      </header>

      <nav className={`container ${styles.filters}`} aria-label={t('filter_category')}>
        <Link
          href={hrefFor('all', activeBrand)}
          className={styles.chip}
          data-active={category === 'all'}
        >
          {t('filter_all')}
        </Link>
        {categories.map((entry) => (
          <Link
            key={entry.id}
            href={hrefFor(entry.id, activeBrand)}
            className={styles.chip}
            data-active={category === entry.id}
          >
            {t(entry.labelKey)}
          </Link>
        ))}
      </nav>

      {availableBrands.length > 1 && (
        <nav className={`container ${styles.brandFilters}`} aria-label={t('filter_brand')}>
          <span className={styles.brandLabel}>{t('filter_brand')}</span>
          <Link
            href={hrefFor(category, 'all')}
            className={styles.brandChip}
            data-active={activeBrand === 'all'}
          >
            {t('filter_all')}
          </Link>
          {availableBrands.map((brand) => (
            <Link
              key={brand.id}
              href={hrefFor(category, brand.id)}
              className={styles.brandChip}
              data-active={activeBrand === brand.id}
            >
              {brand.name}
            </Link>
          ))}
        </nav>
      )}

      <section className="container" style={{ paddingBottom: 'var(--space-10)' }}>
        <p className={styles.count}>
          {items.length} {t('nav_products')}
        </p>

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
