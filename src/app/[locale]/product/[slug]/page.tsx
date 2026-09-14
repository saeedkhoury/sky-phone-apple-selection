import { notFound } from 'next/navigation'
import { products } from '@/lib/catalog/products'
import { getProductBySlug } from '@/lib/catalog/query'
import { ProductDetail } from '@/components/product/ProductDetail'
import { LOCALES, isLocale } from '@/lib/i18n/config'
import { SHOP } from '@/lib/shop'

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    products.map((product) => ({ locale, slug: product.slug })),
  )
}

export async function generateMetadata({ params }: PageProps<'/[locale]/product/[slug]'>) {
  const { locale, slug } = await params
  const product = getProductBySlug(slug)
  if (!product || !isLocale(locale)) return { title: SHOP.name }

  return {
    title: `${product.name} — ${SHOP.name}`,
    description: product.description[locale],
  }
}

export default async function ProductPage({ params }: PageProps<'/[locale]/product/[slug]'>) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const product = getProductBySlug(slug)
  if (!product) notFound()

  return <ProductDetail product={product} />
}
