import type { CartLine, CartState } from './types'

/** Sum of every line's unit price times its quantity, in integer cents. */
export function selectSubtotal(state: CartState): number {
  return state.lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0)
}

/** Total number of units in the cart — the badge number, not the line count. */
export function selectLineCount(state: CartState): number {
  return state.lines.reduce((count, line) => count + line.quantity, 0)
}

export function selectLine(
  state: CartState,
  productId: string,
  variantId: string,
): CartLine | undefined {
  return state.lines.find(
    (line) => line.productId === productId && line.variantId === variantId,
  )
}

export function selectIsEmpty(state: CartState): boolean {
  return state.lines.length === 0
}
