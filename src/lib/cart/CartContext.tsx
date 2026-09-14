'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { cartReducer, emptyCart } from './reducer'
import { selectLineCount, selectSubtotal } from './selectors'
import type { CartItemInput, CartState } from './types'

const STORAGE_KEY = 'axiom.cart.v1'

interface CartContextValue {
  state: CartState
  /** False until localStorage has been read, so SSR and first paint agree. */
  isHydrated: boolean
  itemCount: number
  subtotal: number
  addItem: (item: CartItemInput, quantity?: number) => void
  removeItem: (productId: string, variantId: string) => void
  setQuantity: (productId: string, variantId: string, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function readStoredCart(): CartState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CartState
  } catch {
    // Private mode, quota errors, or corrupt JSON: start from an empty cart.
    return null
  }
}

/** False during server render and the first client pass, true once mounted. */
const NOOP_SUBSCRIBE = () => () => {}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, emptyCart)
  const isHydrated = useSyncExternalStore(
    NOOP_SUBSCRIBE,
    () => true,
    () => false,
  )

  // Read persisted state after mount so the server and client render the same
  // markup on the first pass.
  useEffect(() => {
    const stored = readStoredCart()
    if (stored) dispatch({ type: 'HYDRATE', state: stored })
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Storage unavailable — the cart still works for this session.
    }
  }, [state, isHydrated])

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      isHydrated,
      itemCount: selectLineCount(state),
      subtotal: selectSubtotal(state),
      addItem: (item, quantity = 1) => dispatch({ type: 'ADD_ITEM', item, quantity }),
      removeItem: (productId, variantId) =>
        dispatch({ type: 'REMOVE_ITEM', productId, variantId }),
      setQuantity: (productId, variantId, quantity) =>
        dispatch({ type: 'SET_QUANTITY', productId, variantId, quantity }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [state, isHydrated],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider')
  }
  return context
}
