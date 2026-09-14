import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { categories } from '@/lib/catalog/categories'
import { LOCALES, isLocale, translate } from '@/lib/i18n/config'
import { SHOP } from '@/lib/shop'
import { BrandLoader } from '@/components/ui/BrandLoader'
import { CategoryResults } from './CategoryResults'

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
  if (category !== 'all' && !categories.some((entry) => entry.id === category)) notFound()

  return (
    <Suspense fallback={<BrandLoader locale={locale} />}>
      <CategoryResults locale={locale} category={category} />
    </Suspense>
  )
}
