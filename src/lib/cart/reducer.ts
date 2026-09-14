import type { CartAction, CartLine, CartState } from './types'

/** Retail-style per-line cap, so a stray keystroke cannot order 9999 laptops. */
export const MAX_LINE_QUANTITY = 10

/**
 * Upper bounds for state restored from localStorage, which the user can edit
 * freely in devtools. Nothing here is a security control — there is no backend
 * to defraud — but it keeps an edited payload from rendering absurd totals or
 * bloating every subsequent write. $1,000,000 in cents.
 */
export const MAX_UNIT_PRICE = 100_000_000
export const MAX_CART_LINES = 50

export const emptyCart: CartState = { lines: [] }

function isSameLine(line: CartLine, productId: string, variantId: string): boolean {
  return line.productId === productId && line.variantId === variantId
}

function clampQuantity(quantity: number): number {
  return Math.min(Math.max(Math.trunc(quantity), 0), MAX_LINE_QUANTITY)
}

/**
 * Hydration reads from localStorage, which is user-writable and may hold data
 * from an older release. Anything that does not match the current line shape is
 * discarded rather than trusted.
 */
function isValidLine(value: unknown): value is CartLine {
  if (typeof value !== 'object' || value === null) return false
  const line = value as Record<string, unknown>
  return (
    typeof line.productId === 'string' &&
    typeof line.variantId === 'string' &&
    typeof line.name === 'string' &&
    typeof line.variantName === 'string' &&
    typeof line.slug === 'string' &&
    Number.isInteger(line.unitPrice) &&
    (line.unitPrice as number) >= 0 &&
    (line.unitPrice as number) <= MAX_UNIT_PRICE &&
    Number.isInteger(line.quantity) &&
    (line.quantity as number) > 0
  )
}

function sanitize(state: CartState | undefined): CartState {
  if (!state || !Array.isArray(state.lines)) return emptyCart
  const lines = state.lines
    .filter(isValidLine)
    .slice(0, MAX_CART_LINES)
    .map((line) => ({
      ...line,
      quantity: clampQuantity(line.quantity),
    }))
  return { lines }
}

function addItem(state: CartState, action: Extract<CartAction, { type: 'ADD_ITEM' }>): CartState {
  const requested = Math.trunc(action.quantity)
  if (requested < 1) return state

  const { productId, variantId } = action.item
  const existing = state.lines.find((line) => isSameLine(line, productId, variantId))

  if (existing) {
    return {
      lines: state.lines.map((line) =>
        isSameLine(line, productId, variantId)
          ? { ...line, quantity: clampQuantity(line.quantity + requested) }
          : line,
      ),
    }
  }

  return {
    lines: [...state.lines, { ...action.item, quantity: clampQuantity(requested) }],
  }
}

function setQuantity(
  state: CartState,
  action: Extract<CartAction, { type: 'SET_QUANTITY' }>,
): CartState {
  const { productId, variantId } = action
  const quantity = clampQuantity(action.quantity)

  if (quantity === 0) {
    return removeItem(state, productId, variantId)
  }

  return {
    lines: state.lines.map((line) =>
      isSameLine(line, productId, variantId) ? { ...line, quantity } : line,
    ),
  }
}

function removeItem(state: CartState, productId: string, variantId: string): CartState {
  return { lines: state.lines.filter((line) => !isSameLine(line, productId, variantId)) }
}

/** Pure reducer: never mutates the incoming state, always returns a fresh object. */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return addItem(state, action)
    case 'SET_QUANTITY':
      return setQuantity(state, action)
    case 'REMOVE_ITEM':
      return removeItem(state, action.productId, action.variantId)
    case 'CLEAR':
      return emptyCart
    case 'HYDRATE':
      return sanitize(action.state)
    default:
      return state
  }
}
