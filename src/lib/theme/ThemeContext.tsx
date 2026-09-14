'use client'

import { useSyncExternalStore } from 'react'
import {
  getServerSnapshot,
  getSnapshot,
  setTheme,
  subscribe,
  type Theme,
} from './themeStore'

export type { Theme }

/**
 * Reads the theme from the external store. No provider is needed — the store is
 * module-level — so any component can call this directly.
 */
export function useTheme(): { theme: Theme; setTheme: (theme: Theme) => void } {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return { theme, setTheme }
}
