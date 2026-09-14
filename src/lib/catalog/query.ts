import { products } from './products'
import type { Product, SortOrder } from './types'

/** Weighted so a name hit always outranks a tagline or description hit. */
const WEIGHT_NAME = 100
const WEIGHT_TAGLINE = 10
const WEIGHT_DESCRIPTION = 1

function scoreProduct(product: Product, needle: string): number {
  let score = 0
  if (product.name.toLowerCase().includes(needle)) score += WEIGHT_NAME
  if (product.tagline.toLowerCase().includes(needle)) score += WEIGHT_TAGLINE
  if (product.description.toLowerCase().includes(needle)) score += WEIGHT_DESCRIPTION
  return score
}

/**
 * Substring search over name, tagline and description, ranked by where the
 * match landed. An empty query returns the full list unchanged.
 */
export function searchProducts(
  source: readonly Product[],
  query: string,
): readonly Product[] {
  const needle = query.trim().toLowerCase()
  if (needle === '') return [...source]

  return source
    .map((product) => ({ product, score: scoreProduct(product, needle) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.product)
}

/** `'all'` is the catch-all category used by the store landing page. */
export function filterByCategory(
  source: readonly Product[],
  categoryId: string,
): readonly Product[] {
  if (categoryId === 'all') return [...source]
  return source.filter((product) => product.categoryId === categoryId)
}

/** Products are compared on their entry-level (first) variant price. */
function basePrice(product: Product): number {
  return product.variants[0].price
}

export function sortProducts(
  source: readonly Product[],
  order: SortOrder,
): readonly Product[] {
  const copy = [...source]

  switch (order) {
    case 'price-asc':
      return copy.sort((a, b) => basePrice(a) - basePrice(b))
    case 'price-desc':
      return copy.sort((a, b) => basePrice(b) - basePrice(a))
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    case 'featured':
    default:
      return copy.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

export function getFeaturedProducts(): readonly Product[] {
  return products.filter((product) => product.featured)
}

export function getProductsByCategory(categoryId: string): readonly Product[] {
  return filterByCategory(products, categoryId)
}
