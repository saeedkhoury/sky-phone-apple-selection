import type { Locale } from '@/lib/i18n/config'

/** Trilingual free text carried straight from the shop's approved copy. */
export type Localised = Record<Locale, string>

export interface Colour {
  name: string
  hex: string
  /** Some colours have their own photography; others reuse the product's. */
  images?: readonly string[]
}

export interface StorageOption {
  label: string
  /** Price difference from the base price, in whole shekels. */
  delta: number
}

export type CategoryId = 'phones' | 'tablets' | 'computers' | 'gaming' | 'accessories'

export interface Product {
  id: string
  slug: string
  name: string
  categoryId: string
  brand: string
  /** Line-icon key used as the fallback when a photo fails to load. */
  icon: string
  badge?: 'new' | 'hot' | string
  /** Base price in whole shekels. */
  price: number
  image: string
  images: readonly string[]
  colors?: readonly Colour[]
  storage?: readonly StorageOption[]
  variant2Label?: string
  description: Localised
}

export interface Category {
  id: CategoryId
  /** Translation key for the display name. */
  labelKey: string
}

export interface Brand {
  id: string
  name: string
}

export type SortOrder = 'featured' | 'price-asc' | 'price-desc' | 'name'
