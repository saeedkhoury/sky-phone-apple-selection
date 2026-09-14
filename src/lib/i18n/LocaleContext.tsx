'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import {
  directionFor,
  translate,
  type Direction,
  type Locale,
  type MessageKey,
} from './config'

interface LocaleContextValue {
  locale: Locale
  dir: Direction
  isRtl: boolean
  t: (key: MessageKey | string) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

/**
 * The locale comes from the route segment, so it is known at render time on the
 * server and never changes for the life of a page — switching language is a
 * navigation, not a state update. That keeps the translation lookup free of
 * effects and makes every page statically renderable per language.
 */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: directionFor(locale),
      isRtl: directionFor(locale) === 'rtl',
      t: (key) => translate(locale, key),
    }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used inside a LocaleProvider')
  }
  return context
}
