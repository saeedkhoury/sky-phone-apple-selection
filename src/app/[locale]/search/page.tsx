import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { BrandLoader } from '@/components/ui/BrandLoader'
import { isLocale } from '@/lib/i18n/config'
import { SHOP } from '@/lib/shop'
import { SearchResults } from './SearchResults'

export const metadata = { title: SHOP.name }

export default async function SearchPage({ params }: PageProps<'/[locale]/search'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <Suspense fallback={<BrandLoader locale={locale} />}>
      <SearchResults locale={locale} />
    </Suspense>
  )
}
