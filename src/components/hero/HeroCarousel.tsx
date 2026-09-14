'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ProductArt } from '@/components/product/ProductArt'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { formatPrice } from '@/lib/format/currency'
import type { Product } from '@/lib/catalog/types'
import { Button } from '../ui/Button'
import { PauseIcon, PlayIcon } from '../nav/NavIcons'
import styles from './HeroCarousel.module.css'

const ROTATE_MS = 7000

export function HeroCarousel({ slides }: { slides: readonly Product[] }) {
  const [index, setIndex] = useState(0)
  // A deliberate, sticky stop — not the transient hover/focus pause a pointer
  // user gets. Once someone stops the carousel it stays stopped (WCAG 2.2.2).
  const [isStopped, setIsStopped] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const isRotating = !isStopped && !isHovering && !prefersReducedMotion && slides.length > 1

  useEffect(() => {
    if (!isRotating) return
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      ROTATE_MS,
    )
    return () => window.clearInterval(timer)
  }, [isRotating, slides.length])

  if (slides.length === 0) return null

  const product = slides[index]
  const base = product.variants[0]

  function showSlide(next: number) {
    setIndex(next)
    // Choosing a slide by hand means the user wants to look at it, so stop
    // rotating out from under them.
    setIsStopped(true)
  }

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={styles.slide} key={product.id}>
        <div>
          {product.badge && <p className={styles.eyebrow}>{product.badge}</p>}
          {/* h2, not h1: this heading changes on a timer, and a page's h1
              should be stable for heading navigation. */}
          <h2 className={styles.title}>{product.name}</h2>
          <p className={styles.copy}>{product.tagline}</p>
          <div className={styles.actions}>
            <Button href={`/product/${product.slug}`}>Buy</Button>
            <Link href={`/product/${product.slug}`}>
              Learn more from {formatPrice(base.price)} ›
            </Link>
          </div>
        </div>

        <div
          className={styles.art}
          style={{
            background: `radial-gradient(70% 60% at 50% 40%, ${base.swatch}44, transparent)`,
          }}
        >
          <ProductArt
            categoryId={product.categoryId}
            swatch={base.swatch}
            className={styles.artShape}
          />
        </div>
      </div>

      {/* A polite, text-only status. Announcing the whole slide would interrupt
          a screen reader every seven seconds. */}
      <p className="visually-hidden" aria-live="polite">
        {`Slide ${index + 1} of ${slides.length}: ${product.name}`}
      </p>

      <div className={styles.controls}>
        {slides.length > 1 && (
          <button
            type="button"
            className={styles.playPause}
            aria-pressed={isStopped}
            aria-label={isStopped ? 'Start the carousel' : 'Stop the carousel'}
            onClick={() => setIsStopped((stopped) => !stopped)}
          >
            {isStopped ? <PlayIcon /> : <PauseIcon />}
          </button>
        )}

        <div className={styles.dots}>
          {slides.map((slide, dotIndex) => (
            <button
              key={slide.id}
              type="button"
              className={styles.dot}
              aria-current={dotIndex === index}
              aria-label={`Show ${slide.name}`}
              onClick={() => showSlide(dotIndex)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
