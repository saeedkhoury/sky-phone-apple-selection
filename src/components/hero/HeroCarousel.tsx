'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { useLocale } from '@/lib/i18n/LocaleContext'
import { formatPriceFor } from '@/lib/format/currency'
import { whatsappLink } from '@/lib/shop'
import type { Product } from '@/lib/catalog/types'
import { Button } from '../ui/Button'
import { PauseIcon, PlayIcon } from '../nav/NavIcons'
import styles from './HeroCarousel.module.css'

const ROTATE_MS = 7000
const LOOP_RESET_MS = 520
const PROGRAMMATIC_SCROLL_MS = 680

export interface HeroCta {
  /** Translation key for the button label. */
  labelKey: string
  variant: 'primary' | 'secondary'
  /** Either an internal route or a WhatsApp message key, never both. */
  href?: string
  whatsappKey?: string
}

export interface HeroSlide {
  id: string
  /** Translation key for the badge above the title. */
  badgeKey: string
  title: string
  /** Translation key for the headline strap. */
  tagKey: string
  /** Translation key for the supporting line. */
  noteKey?: string
  image: string
  alt: string
  /** Live price line, for slides tied to a real product. */
  product?: Product
  ctas: readonly HeroCta[]
}

export function HeroCarousel({ slides }: { slides: readonly HeroSlide[] }) {
  const { locale, t } = useLocale()
  const [index, setIndex] = useState(0)
  // The first and last cards are duplicated visually. This lets the first
  // slide have a real neighbouring card on both sides, while the duplicate is
  // kept out of the accessibility tree and never receives focus.
  const [position, setPosition] = useState(1)
  const [isStopped, setIsStopped] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isHeroVisible, setIsHeroVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<Array<HTMLElement | null>>([])
  const indexRef = useRef(0)
  const hasPositionedInitially = useRef(false)
  const jumpOnNextPosition = useRef(false)
  const isProgrammaticScroll = useRef(false)
  const scrollUnlockTimer = useRef<number | undefined>(undefined)
  const scrollSettleTimer = useRef<number | undefined>(undefined)

  const renderedSlides =
    slides.length > 1
      ? [
          { slide: slides[slides.length - 1], sourceIndex: slides.length - 1, clone: true },
          ...slides.map((slide, sourceIndex) => ({ slide, sourceIndex, clone: false })),
          { slide: slides[0], sourceIndex: 0, clone: true },
        ]
      : slides.map((slide, sourceIndex) => ({ slide, sourceIndex, clone: false }))
  const activePosition = slides.length > 1 ? position : 0

  const isRotating =
    isHeroVisible && !isStopped && !isHovering && !prefersReducedMotion && slides.length > 1

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    // Do not rotate an advertisement that the visitor cannot see. Apart from
    // respecting their attention, this prevents an off-screen slide change
    // from ever moving the document back to the hero.
    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0.1 },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  const moveToSlide = useCallback(
    (
      next: number,
      { stop, moveForwardThroughLoop = false }: { stop: boolean; moveForwardThroughLoop?: boolean },
    ) => {
      indexRef.current = next
      setIndex(next)
      setPosition(
        slides.length > 1 && moveForwardThroughLoop ? slides.length + 1 : next + 1,
      )
      if (stop) setIsStopped(true)
    },
    [slides.length],
  )

  useEffect(() => {
    if (!isRotating) return
    const timer = window.setInterval(() => {
      const next = (indexRef.current + 1) % slides.length
      moveToSlide(next, {
        stop: false,
        moveForwardThroughLoop: next === 0,
      })
    }, ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [isRotating, moveToSlide, slides.length])

  useEffect(() => {
    if (!isHeroVisible) return

    const viewport = viewportRef.current
    const slide = slideRefs.current[activePosition]
    if (!viewport || !slide) return

    const shouldJump = jumpOnNextPosition.current || !hasPositionedInitially.current
    jumpOnNextPosition.current = false
    hasPositionedInitially.current = true
    isProgrammaticScroll.current = true

    // Only move the horizontal card rail. `scrollIntoView` also considers the
    // document scroller, which can pull someone reading the page back to the
    // hero when the carousel advances on its own.
    const viewportBox = viewport.getBoundingClientRect()
    const slideBox = slide.getBoundingClientRect()
    const physicalDelta =
      slideBox.left + slideBox.width / 2 - (viewportBox.left + viewportBox.width / 2)
    viewport.scrollBy({
      // `scrollBy` accepts a physical horizontal delta, so this works for
      // both LTR and RTL rails without relying on browser-specific RTL
      // `scrollLeft` conventions.
      left: physicalDelta,
      behavior: shouldJump || prefersReducedMotion ? 'auto' : 'smooth',
    })

    if (scrollUnlockTimer.current !== undefined) {
      window.clearTimeout(scrollUnlockTimer.current)
    }
    scrollUnlockTimer.current = window.setTimeout(
      () => {
        isProgrammaticScroll.current = false
      },
      shouldJump || prefersReducedMotion ? 0 : PROGRAMMATIC_SCROLL_MS,
    )
  }, [activePosition, isHeroVisible, prefersReducedMotion])

  useEffect(() => {
    // Advance from the last real card to the duplicated first card, then jump
    // back to the first real card after the transition. The visitor sees a
    // continuous loop, while the DOM retains one semantic instance per slide.
    if (slides.length < 2 || position !== slides.length + 1) return

    const timer = window.setTimeout(
      () => {
        jumpOnNextPosition.current = true
        setPosition(1)
      },
      prefersReducedMotion ? 0 : LOOP_RESET_MS,
    )

    return () => window.clearTimeout(timer)
  }, [position, prefersReducedMotion, slides.length])

  useEffect(() => {
    return () => {
      if (scrollUnlockTimer.current !== undefined) {
        window.clearTimeout(scrollUnlockTimer.current)
      }
      if (scrollSettleTimer.current !== undefined) {
        window.clearTimeout(scrollSettleTimer.current)
      }
    }
  }, [])

  if (slides.length === 0) return null

  const slide = slides[index]

  function showSlide(next: number) {
    // Choosing a slide by hand means the visitor wants to look at it.
    moveToSlide(next, { stop: true })
  }

  function settleAfterScroll() {
    if (slides.length < 2 || isProgrammaticScroll.current || !viewportRef.current) return

    const viewport = viewportRef.current.getBoundingClientRect()
    const viewportCenter = viewport.left + viewport.width / 2
    const nearestPosition = slideRefs.current.reduce(
      (nearest, candidate, candidateIndex) => {
        if (!candidate) return nearest
        const candidateBox = candidate.getBoundingClientRect()
        const candidateDistance = Math.abs(candidateBox.left + candidateBox.width / 2 - viewportCenter)
        const nearestBox = slideRefs.current[nearest]?.getBoundingClientRect()
        const nearestDistance = nearestBox
          ? Math.abs(nearestBox.left + nearestBox.width / 2 - viewportCenter)
          : Number.POSITIVE_INFINITY
        return candidateDistance < nearestDistance ? candidateIndex : nearest
      },
      activePosition,
    )

    if (slides.length > 1 && nearestPosition === 0) {
      jumpOnNextPosition.current = true
      moveToSlide(slides.length - 1, { stop: true })
      return
    }

    if (slides.length > 1 && nearestPosition === slides.length + 1) {
      jumpOnNextPosition.current = true
      moveToSlide(0, { stop: true })
      return
    }

    moveToSlide(nearestPosition - 1, { stop: true })
  }

  function handleScroll() {
    if (isProgrammaticScroll.current) return
    if (scrollSettleTimer.current !== undefined) {
      window.clearTimeout(scrollSettleTimer.current)
    }
    scrollSettleTimer.current = window.setTimeout(settleAfterScroll, 120)
  }

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label={t('fy_brands_l')}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={styles.viewport} ref={viewportRef} onScroll={handleScroll}>
        {renderedSlides.map(({ slide: entry, sourceIndex, clone }, renderedIndex) => {
          const isVisibleSlide = renderedIndex === activePosition
          const isSemanticActive = !clone && sourceIndex === index

          return (
            <article
              key={`${entry.id}-${clone ? `clone-${renderedIndex}` : 'slide'}`}
              ref={(element) => {
                slideRefs.current[renderedIndex] = element
              }}
              className={styles.slide}
              data-active={isVisibleSlide}
              data-hero-active={isSemanticActive}
              aria-hidden={!isSemanticActive}
              aria-roledescription="slide"
              aria-label={`${sourceIndex + 1} / ${slides.length}`}
              inert={!isSemanticActive || undefined}
            >
              <div className={styles.copy}>
                <p className={styles.eyebrow}>{t(entry.badgeKey)}</p>
                {/* h2, not h1: this heading changes on a timer. */}
                <h2 className={styles.title}>{entry.title}</h2>
                <p className={styles.tag}>{t(entry.tagKey)}</p>
                {entry.noteKey && <p className={styles.note}>{t(entry.noteKey)}</p>}
                {entry.product && (
                  <p className={styles.price}>
                    {t('cat_from')} {formatPriceFor(locale, entry.product.price)}
                  </p>
                )}

                <div className={styles.actions}>
                  {entry.ctas.map((cta) => {
                    const href = cta.whatsappKey
                      ? whatsappLink(t(cta.whatsappKey))
                      : (cta.href ?? '#')
                    return (
                      <Button key={cta.labelKey} href={href} variant={cta.variant}>
                        {t(cta.labelKey)}
                      </Button>
                    )
                  })}
                  {entry.product && (
                    <Link href={`/${locale}/product/${entry.product.slug}`}>
                      {t('cta_details')}
                    </Link>
                  )}
                </div>
              </div>

              <div className={styles.art}>
                <div className={styles.artFrame}>
                  {/* A fill image is bounded by the visible art frame. This keeps
                      portrait assets, such as the PS5, fully visible rather than
                      letting their intrinsic height overflow the frame. */}
                  <Image
                    src={entry.image}
                    alt={entry.alt}
                    fill
                    sizes="(max-width: 833px) calc(100vw - 64px), 40vw"
                    className={styles.artImage}
                    preload={!clone && sourceIndex === 0}
                  />
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <p className="visually-hidden" aria-live="polite">
        {`${index + 1} / ${slides.length} — ${slide.title}`}
      </p>

      <div className={styles.controls}>
        <div className={styles.dots}>
          {slides.map((entry, dotIndex) => (
            <button
              key={entry.id}
              type="button"
              className={styles.dot}
              aria-current={dotIndex === index}
              aria-label={entry.title}
              onClick={() => showSlide(dotIndex)}
            />
          ))}
        </div>
        {slides.length > 1 && (
          <button
            type="button"
            className={styles.playPause}
            aria-pressed={isStopped}
            aria-label={isStopped ? t('reel_watch') : t('lb_close')}
            onClick={() => setIsStopped((stopped) => !stopped)}
          >
            {isStopped ? <PlayIcon /> : <PauseIcon />}
          </button>
        )}
      </div>
    </section>
  )
}
