import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
  getServerSnapshot,
  getSnapshot,
  isTheme,
  setTheme,
  subscribe,
} from './themeStore'

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('isTheme', () => {
  it.each(['light', 'dark', 'auto'])('accepts %s', (value) => {
    expect(isTheme(value)).toBe(true)
  })

  it.each(['', 'blue', null, undefined, 42, {}])('rejects %s', (value) => {
    expect(isTheme(value)).toBe(false)
  })
})

describe('getServerSnapshot', () => {
  it('always returns the dark default, since the server has no storage', () => {
    expect(getServerSnapshot()).toBe('dark')
  })
})

describe('setTheme', () => {
  it('reflects the theme on the document element', () => {
    setTheme('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('persists the choice to localStorage', () => {
    setTheme('auto')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('auto')
  })

  it('becomes the current snapshot', () => {
    setTheme('light')
    expect(getSnapshot()).toBe('light')
  })

  it('notifies subscribers', () => {
    const listener = vi.fn()
    subscribe(listener)
    setTheme('dark')
    expect(listener).toHaveBeenCalled()
  })

  it('stops notifying after unsubscribe', () => {
    const listener = vi.fn()
    subscribe(listener)()
    setTheme('light')
    expect(listener).not.toHaveBeenCalled()
  })

  it('still applies the theme when storage throws', () => {
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota exceeded')
      })

    expect(() => setTheme('light')).not.toThrow()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    setItem.mockRestore()
  })
})

describe('THEME_INIT_SCRIPT', () => {
  it('references the same storage key the store writes to', () => {
    expect(THEME_INIT_SCRIPT).toContain(THEME_STORAGE_KEY)
  })

  it('is self-contained and swallows storage errors', () => {
    expect(THEME_INIT_SCRIPT).toContain('try')
    expect(THEME_INIT_SCRIPT).toContain('catch')
  })

  it('contains no interpolation holes left unresolved', () => {
    expect(THEME_INIT_SCRIPT).not.toContain('${')
  })

  it('applies a stored theme to the document when executed', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light')
    // The script is what ships in the inline <script> tag.
    new Function(THEME_INIT_SCRIPT)()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('leaves the document alone for an unrecognised stored value', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'neon')
    new Function(THEME_INIT_SCRIPT)()
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
  })
})
