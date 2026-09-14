export type Theme = 'light' | 'dark' | 'auto'

export const THEME_STORAGE_KEY = 'axiom.theme'

const THEMES: readonly Theme[] = ['light', 'dark', 'auto']
const DEFAULT_THEME: Theme = 'dark'

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value)
}

/**
 * Theme lives outside React: it is written to localStorage and reflected on the
 * document element by an inline script before first paint. Exposing it through
 * useSyncExternalStore keeps the server and client snapshots explicit instead of
 * patching state in an effect after mount.
 */

let current: Theme | null = null
const listeners = new Set<() => void>()

function readStored(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): Theme {
  current ??= readStored()
  return current
}

/** The server has no storage, so it always renders the default. */
export function getServerSnapshot(): Theme {
  return DEFAULT_THEME
}

export function setTheme(next: Theme): void {
  current = next
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, next)
  } catch {
    // Non-fatal: the choice just will not persist.
  }
  document.documentElement.setAttribute('data-theme', next)
  listeners.forEach((listener) => listener())
}

/**
 * Runs before paint via a blocking inline script so the correct theme is on the
 * document element from the very first frame — no flash of the wrong palette.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark'||t==='auto'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();`
