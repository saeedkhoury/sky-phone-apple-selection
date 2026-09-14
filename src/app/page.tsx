import Link from 'next/link'
import { HeroCarousel } from '@/components/hero/HeroCarousel'
import { ProductTile } from '@/components/tiles/ProductTile'
import { TileGrid } from '@/components/tiles/TileGrid'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { categories, products } from '@/lib/catalog/products'
import { getFeaturedProducts } from '@/lib/catalog/query'
import styles from './page.module.css'

export default function HomePage() {
  const featured = getFeaturedProducts()
  const latest = products.slice(0, 6)

  return (
    <>
      <HeroCarousel slides={featured} />

      <section className="container section">
        <SectionHeader
          title="Shop by category"
          subtitle="Five product lines, one system."
        />
        <TileGrid columns={3}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/store/${category.id}`}
              className={styles.categoryTile}
              style={{
                background: `linear-gradient(160deg, ${category.gradient[0]}, ${category.gradient[1]})`,
              }}
            >
              <h3 className={styles.categoryName}>{category.name}</h3>
              <p className={styles.categoryTagline}>{category.tagline}</p>
            </Link>
          ))}
        </TileGrid>
      </section>

      <section className="container section">
        <SectionHeader
          title="Latest releases"
          subtitle="The newest hardware across the range."
          action={{ href: '/store/all', label: 'View all products' }}
        />
        <TileGrid columns={3}>
          {latest.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </TileGrid>
      </section>

      <section className="container section">
        <div className={styles.banner}>
          <h2 className={styles.bannerTitle}>Free delivery. Always.</h2>
          <p className={styles.bannerCopy}>
            Every order ships free, arrives in two days, and comes with a thirty-day return
            window — no questions, no restocking fee.
          </p>
          <Button href="/store/all" large>
            Shop the full range
          </Button>
        </div>
      </section>
    </>
  )
}
