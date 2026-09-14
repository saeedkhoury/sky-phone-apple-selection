import { describe, it, expect } from 'vitest'
import { searchProducts, filterByCategory, sortProducts, getProductBySlug } from './query'
import { products, categories } from './products'

describe('catalog data integrity', () => {
  it('ships a non-empty catalog', () => {
    expect(products.length).toBeGreaterThan(0)
  })

  it('gives every product a unique slug', () => {
    const slugs = products.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('assigns every product to a known category', () => {
    const ids = new Set(categories.map((c) => c.id))
    expect(products.every((p) => ids.has(p.categoryId))).toBe(true)
  })

  it('gives every product at least one variant', () => {
    expect(products.every((p) => p.variants.length > 0)).toBe(true)
  })

  it('prices every variant as a positive integer number of cents', () => {
    const prices = products.flatMap((p) => p.variants.map((v) => v.price))
    expect(prices.every((n) => Number.isInteger(n) && n > 0)).toBe(true)
  })
})

describe('searchProducts', () => {
  it('returns every product for an empty query', () => {
    expect(searchProducts(products, '')).toHaveLength(products.length)
  })

  it('returns every product for a whitespace-only query', () => {
    expect(searchProducts(products, '   ')).toHaveLength(products.length)
  })

  it('matches on product name case-insensitively', () => {
    const target = products[0]
    const results = searchProducts(products, target.name.toUpperCase())
    expect(results.map((p) => p.slug)).toContain(target.slug)
  })

  it('matches on a partial substring of the name', () => {
    const target = products[0]
    const results = searchProducts(products, target.name.slice(0, 4))
    expect(results.map((p) => p.slug)).toContain(target.slug)
  })

  it('matches on the tagline', () => {
    const target = products[0]
    const word = target.tagline.split(' ')[0]
    expect(searchProducts(products, word).length).toBeGreaterThan(0)
  })

  it('returns an empty array when nothing matches', () => {
    expect(searchProducts(products, 'zzzzzzqqqq')).toEqual([])
  })

  it('ranks a name match above a description-only match', () => {
    const target = products[0]
    const results = searchProducts(products, target.name)
    expect(results[0].slug).toBe(target.slug)
  })

  it('does not mutate the source array', () => {
    const before = [...products]
    searchProducts(products, 'pro')
    expect(products).toEqual(before)
  })
})

describe('filterByCategory', () => {
  it('returns only products in the requested category', () => {
    const id = categories[0].id
    expect(filterByCategory(products, id).every((p) => p.categoryId === id)).toBe(true)
  })

  it('returns every product when the category is "all"', () => {
    expect(filterByCategory(products, 'all')).toHaveLength(products.length)
  })

  it('returns an empty array for an unknown category', () => {
    expect(filterByCategory(products, 'not-a-category')).toEqual([])
  })
})

describe('sortProducts', () => {
  it('sorts by price ascending', () => {
    const sorted = sortProducts(products, 'price-asc')
    const prices = sorted.map((p) => p.variants[0].price)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  it('sorts by price descending', () => {
    const sorted = sortProducts(products, 'price-desc')
    const prices = sorted.map((p) => p.variants[0].price)
    expect(prices).toEqual([...prices].sort((a, b) => b - a))
  })

  it('sorts by name alphabetically', () => {
    const names = sortProducts(products, 'name').map((p) => p.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })

  it('returns a new array rather than sorting in place', () => {
    const before = [...products]
    sortProducts(products, 'price-desc')
    expect(products).toEqual(before)
  })
})

describe('getProductBySlug', () => {
  it('finds a product by its slug', () => {
    expect(getProductBySlug(products[0].slug)?.slug).toBe(products[0].slug)
  })

  it('returns undefined for an unknown slug', () => {
    expect(getProductBySlug('no-such-product')).toBeUndefined()
  })
})
