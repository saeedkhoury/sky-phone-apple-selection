import type { Locale } from '@/lib/i18n/config'
import { products } from './products'
import type { Product, SortOrder } from './types'

/** Weighted so a name hit always outranks a description-only hit. */
const WEIGHT_EXACT_NAME = 1000
const WEIGHT_NAME = 100
const WEIGHT_BRAND = 20
const WEIGHT_DESCRIPTION = 1

function scoreProduct(product: Product, needle: string, locale: Locale): number {
  const name = product.name.toLowerCase()
  let score = 0

  if (name === needle) score += WEIGHT_EXACT_NAME
  if (name.includes(needle)) score += WEIGHT_NAME
  if (product.brand.toLowerCase().includes(needle)) score += WEIGHT_BRAND
  if (product.description[locale]?.toLowerCase().includes(needle)) {
    score += WEIGHT_DESCRIPTION
  }

  return score
}

/**
 * Substring search over name, brand and the description in the *active*
 * language — a Hebrew shopper searching Hebrew words has to find things.
 */
export function searchProducts(
  source: readonly Product[],
  query: string,
  locale: Locale,
): readonly Product[] {
  const needle = query.trim().toLowerCase()
  if (needle === '') return [...source]

  return source
    .map((product) => ({ product, score: scoreProduct(product, needle, locale) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.product)
}

export function filterByCategory(
  source: readonly Product[],
  categoryId: string,
): readonly Product[] {
  if (categoryId === 'all') return [...source]
  return source.filter((product) => product.categoryId === categoryId)
}

export function filterByBrand(
  source: readonly Product[],
  brandId: string,
): readonly Product[] {
  if (brandId === 'all') return [...source]
  return source.filter((product) => product.brand === brandId)
}

/** Price of a product with a given storage option selected. */
export function priceForVariant(product: Product, storageLabel?: string): number {
  if (!storageLabel) return product.price
  const option = product.storage?.find((entry) => entry.label === storageLabel)
  return product.price + (option?.delta ?? 0)
}

export function sortProducts(
  source: readonly Product[],
  order: SortOrder,
): readonly Product[] {
  const copy = [...source]

  switch (order) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price)
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    case 'featured':
    default:
      return copy.sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)))
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

export function getProductsByCategory(categoryId: string): readonly Product[] {
  return filterByCategory(products, categoryId)
}

/** Brand highlight rows on the home page, badged products first. */
export function getHighlights(brandId: string, limit: number): readonly Product[] {
  return sortProducts(filterByBrand(products, brandId), 'featured').slice(0, limit)
}

export function getBadgedProducts(limit: number): readonly Product[] {
  return products.filter((product) => product.badge).slice(0, limit)
}
