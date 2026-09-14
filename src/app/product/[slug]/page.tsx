import { notFound } from 'next/navigation'
import { products } from '@/lib/catalog/products'
import { getProductBySlug } from '@/lib/catalog/query'
import { ProductDetail } from '@/components/product/ProductDetail'

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: PageProps<'/product/[slug]'>) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: 'Product not found — Axiom Store' }
  return { title: `${product.name} — Axiom Store`, description: product.tagline }
}

export default async function ProductPage({ params }: PageProps<'/product/[slug]'>) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) notFound()

  return <ProductDetail product={product} />
}
