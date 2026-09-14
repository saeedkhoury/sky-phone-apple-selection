import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useReducedMotion } from './useReducedMotion'

/**
 * jsdom has no real matchMedia, so it is stubbed with a controllable listener
 * set — which is also what lets the change-notification path be exercised.
 */
function stubMatchMedia(matches: boolean) {
  const listeners = new Set<() => void>()

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches,
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    })),
  )

  return {
    emitChange: () => listeners.forEach((listener) => listener()),
    listenerCount: () => listeners.size,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useReducedMotion', () => {
  it('reports false when the user has expressed no preference', () => {
    stubMatchMedia(false)
    expect(renderHook(() => useReducedMotion()).result.current).toBe(false)
  })

  it('reports true when reduced motion is requested', () => {
    stubMatchMedia(true)
    expect(renderHook(() => useReducedMotion()).result.current).toBe(true)
  })

  it('subscribes to preference changes while mounted', () => {
    const media = stubMatchMedia(false)
    const { unmount } = renderHook(() => useReducedMotion())

    expect(media.listenerCount()).toBe(1)

    unmount()
    expect(media.listenerCount()).toBe(0)
  })

  it('re-reads the preference when the media query changes', () => {
    const media = stubMatchMedia(false)
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)

    // The stub now answers "true" for subsequent reads.
    stubMatchMedia(true)
    act(() => media.emitChange())

    expect(result.current).toBe(true)
  })
})
