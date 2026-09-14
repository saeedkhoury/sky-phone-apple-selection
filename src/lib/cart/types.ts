/** The product/variant snapshot captured when something is added to the cart. */
export interface CartItemInput {
  productId: string
  variantId: string
  name: string
  variantName: string
  /** Unit price in integer cents at the time of adding. */
  unitPrice: number
  slug: string
}

/** A cart line is an item plus the quantity of it. */
export interface CartLine extends CartItemInput {
  quantity: number
}

export interface CartState {
  lines: readonly CartLine[]
}

export type CartAction =
  | { type: 'ADD_ITEM'; item: CartItemInput; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string; variantId: string }
  | { type: 'SET_QUANTITY'; productId: string; variantId: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; state: CartState }
