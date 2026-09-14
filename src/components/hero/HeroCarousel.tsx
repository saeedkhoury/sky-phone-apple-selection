'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ProductArt } from '@/components/product/ProductArt'
import { formatPrice } from '@/lib/format/currency'
import type { Product } from '@/lib/catalog/types'
import { Button } from '../ui/Button'
import styles from './HeroCarousel.module.css'

const ROTATE_MS = 7000

export function HeroCarousel({ slides }: { slides: readonly Product[] }) {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused || slides.length < 2) return
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      ROTATE_MS,
    )
    return () => window.clearInterval(timer)
  }, [isPaused, slides.length])

  if (slides.length === 0) return null

  const product = slides[index]
  const base = product.variants[0]

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        className={styles.slide}
        key={product.id}
        aria-live="polite"
        aria-label={`${index + 1} of ${slides.length}: ${product.name}`}
      >
        <div>
          {product.badge && <p className={styles.eyebrow}>{product.badge}</p>}
          <h1 className={styles.title}>{product.name}</h1>
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

      <div className={styles.dots}>
        {slides.map((slide, dotIndex) => (
          <button
            key={slide.id}
            type="button"
            className={styles.dot}
            aria-current={dotIndex === index}
            aria-label={`Show ${slide.name}`}
            onClick={() => setIndex(dotIndex)}
          />
        ))}
      </div>
    </section>
  )
}
