import type { Brand, Category } from './types'

/** Order matches the shop's own site so the owner recognises it. */
export const categories: readonly Category[] = [
  { id: 'phones', labelKey: 'cat_phones' },
  { id: 'tablets', labelKey: 'cat_tablets' },
  { id: 'computers', labelKey: 'cat_computers' },
  { id: 'gaming', labelKey: 'cat_gaming' },
  { id: 'accessories', labelKey: 'cat_accessories' },
]

export const brands: readonly Brand[] = [
  { id: 'apple', name: 'Apple' },
  { id: 'samsung', name: 'Samsung' },
  { id: 'xiaomi', name: 'Xiaomi' },
  { id: 'dell', name: 'Dell' },
  { id: 'sony', name: 'Sony' },
  // The shop's own data leaves the brand blank for a few SKUs (Steam Deck, the
  // headset, the charger). Rather than invent a manufacturer for them, they
  // group here honestly.
  { id: 'other', name: 'Other' },
]
