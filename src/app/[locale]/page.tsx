import Link from 'next/link'
import Image from 'next/image'
import { HeroCarousel, type HeroSlide } from '@/components/hero/HeroCarousel'
import { ProductTile } from '@/components/tiles/ProductTile'
import { TileGrid } from '@/components/tiles/TileGrid'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { RepairStrip } from '@/components/repairs/RepairStrip'
import { ReelsRow } from '@/components/reels/ReelsRow'
import { categories } from '@/lib/catalog/categories'
import { getHighlights, getProductBySlug } from '@/lib/catalog/query'
import { isLocale, translate } from '@/lib/i18n/config'
import { SHOP } from '@/lib/shop'
import { notFound } from 'next/navigation'
import styles from './page.module.css'

const CATEGORY_ART: Record<string, string> = {
  phones: '/img/iphone15pro-naturaltitanium-1.png',
  tablets: '/img/ipadair-spacegray-1.png',
  computers: '/img/macbookair-midnight-1.png',
  gaming: '/img/ps5-1.png',
  accessories: '/img/airpodspro-default-1.png',
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = (key: string) => translate(locale, key)
  const ps5 = getProductBySlug('playstation-5')

  const slides: HeroSlide[] = [
    {
      id: 'iphone18',
      tagKey: 'ad_i18_tag',
      title: 'iPhone 18 Pro',
      noteKey: 'ad_i18_note',
      image: '/img/iphone18-pro.png',
      ground: 'light',
      whatsappKey: 'wa_i18',
    },
    ...(ps5
      ? [
          {
            id: 'ps5',
            tagKey: 'ps5_tag',
            title: ps5.name,
            image: ps5.image,
            ground: 'light' as const,
            href: `/${locale}/product/${ps5.slug}`,
            product: ps5,
          },
        ]
      : []),
    {
      id: 'repairs',
      tagKey: 'rp_title',
      title: t('rp_hero_tag'),
      noteKey: 'rp_sub',
      image: '/img/gaming-controller.png',
      ground: 'dark',
      href: `/${locale}/repairs`,
      whatsappKey: 'wa_chat_head',
    },
  ]

  const appleHighlights = getHighlights('apple', 3)
  const samsungHighlights = getHighlights('samsung', 3)
  const gamingHighlights = getHighlights('sony', 2)

  return (
    <>
      <h1 className="visually-hidden">
        {SHOP.name} — {t('ab_lead')}
      </h1>

      <HeroCarousel slides={slides} />

      <section className="container section">
        <SectionHeader title={t('nav_products')} subtitle={t('pr_sub')} />
        <TileGrid columns={5}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/store/${category.id}`}
              className={styles.categoryTile}
            >
              <span className={styles.categoryArt}>
                <Image
                  src={CATEGORY_ART[category.id] ?? '/img/charger.webp'}
                  alt=""
                  width={180}
                  height={180}
                  className={styles.categoryPhoto}
                  sizes="180px"
                />
              </span>
              <h3 className={styles.categoryName}>{t(category.labelKey)}</h3>
            </Link>
          ))}
        </TileGrid>
      </section>

      <section className="container section">
        <SectionHeader
          title={t('apple_head')}
          subtitle={t('apple_sub')}
          action={{ href: `/${locale}/store/phones`, label: t('filter_all') }}
        />
        <TileGrid columns={3}>
          {appleHighlights.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </TileGrid>
      </section>

      <section className="container section">
        <SectionHeader title={t('samsung_head')} subtitle={t('samsung_sub')} />
        <TileGrid columns={3}>
          {samsungHighlights.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </TileGrid>
      </section>

      <section className="container section">
        <SectionHeader
          title={t('fy_game_head')}
          subtitle={t('fy_game_sub')}
          action={{ href: `/${locale}/store/gaming`, label: t('filter_all') }}
        />
        <TileGrid columns={2}>
          {gamingHighlights.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </TileGrid>
      </section>

      <RepairStrip locale={locale} />

      <ReelsRow locale={locale} />

      <section className="container section">
        <div className={styles.trust}>
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>{t('trust_years_n')}</span>
            <span className={styles.trustLabel}>{t('trust_years_l')}</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>{t('trust_ig_n')}</span>
            <span className={styles.trustLabel}>{t('trust_ig_l')}</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustNumber}>{t('trust_lang_n')}</span>
            <span className={styles.trustLabel}>{t('trust_lang_l')}</span>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className={styles.banner}>
          <h2 className={styles.bannerTitle}>{t('fy_acc_head')}</h2>
          <p className={styles.bannerCopy}>{t('fy_acc_sub')}</p>
          <Button href={`/${locale}/store/accessories`} large>
            {t('fy_cta1')}
          </Button>
        </div>
      </section>
    </>
  )
}
