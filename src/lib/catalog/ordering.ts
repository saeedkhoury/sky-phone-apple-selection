import { brands, categories } from './categories'
import type { Product } from './types'

const categoryOrder = new Map(categories.map((category, index) => [category.id as string, index]))
const brandOrder = new Map(brands.map((brand, index) => [brand.id, index]))
const LAST = Number.MAX_SAFE_INTEGER

/** One merchandising order for every product surface, independent of locale.
 * Keep categories and brands together, then show their newest models first.
 * Explicit model positions avoid confusing screen sizes, wattages, or numbers
 * from different product families with release generations.
 */
export function compareCatalogProducts(a: Product, b: Product): number {
  return (
    (categoryOrder.get(a.categoryId) ?? LAST) - (categoryOrder.get(b.categoryId) ?? LAST) ||
    (brandOrder.get(a.brand) ?? LAST) - (brandOrder.get(b.brand) ?? LAST) ||
    a.displayOrder - b.displayOrder ||
    a.slug.localeCompare(b.slug, 'en', { numeric: true })
  )
}

export function orderCatalogProducts(source: readonly Product[]): readonly Product[] {
  return [...source].sort(compareCatalogProducts)
}
