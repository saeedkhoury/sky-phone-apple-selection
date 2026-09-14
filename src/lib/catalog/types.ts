export interface Category {
  id: string
  name: string
  tagline: string
  /** Two CSS colors used to generate the category tile's gradient artwork. */
  gradient: readonly [string, string]
}

export interface Variant {
  id: string
  name: string
  /** Price in integer cents. */
  price: number
  /** Hex color used for the swatch and the generated product artwork. */
  swatch: string
}

export interface Spec {
  label: string
  value: string
}

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  categoryId: string
  variants: readonly Variant[]
  specs: readonly Spec[]
  /** Optional eyebrow badge, e.g. "New". */
  badge?: string
  featured?: boolean
}

export type SortOrder = 'featured' | 'price-asc' | 'price-desc' | 'name'
