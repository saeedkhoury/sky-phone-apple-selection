'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { useLocale } from '@/lib/i18n/LocaleContext'
import { formatPriceFor } from '@/lib/format/currency'
import { whatsappLink } from '@/lib/shop'
import type { Product } from '@/lib/catalog/types'
import { Button } from '../ui/Button'
import { PauseIcon, PlayIcon } from '../nav/NavIcons'
import styles from './HeroCarousel.module.css'

const ROTATE_MS = 7000

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
  const [isStopped, setIsStopped] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const isRotating =
    !isStopped && !isHovering && !prefersReducedMotion && slides.length > 1

  useEffect(() => {
    if (!isRotating) return
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      ROTATE_MS,
    )
    return () => window.clearInterval(timer)
  }, [isRotating, slides.length])

  if (slides.length === 0) return null

  const slide = slides[index]

  function showSlide(next: number) {
    setIndex(next)
    // Choosing a slide by hand means the visitor wants to look at it.
    setIsStopped(true)
  }

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label={t('fy_brands_l')}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={styles.slide} key={slide.id}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{t(slide.badgeKey)}</p>
          {/* h2, not h1: this heading changes on a timer. */}
          <h2 className={styles.title}>{slide.title}</h2>
          <p className={styles.tag}>{t(slide.tagKey)}</p>
          {slide.noteKey && <p className={styles.note}>{t(slide.noteKey)}</p>}
          {slide.product && (
            <p className={styles.price}>
              {t('cat_from')} {formatPriceFor(locale, slide.product.price)}
            </p>
          )}

          <div className={styles.actions}>
            {slide.ctas.map((cta) => {
              const href = cta.whatsappKey
                ? whatsappLink(t(cta.whatsappKey))
                : (cta.href ?? '#')
              return (
                <Button key={cta.labelKey} href={href} variant={cta.variant}>
                  {t(cta.labelKey)}
                </Button>
              )
            })}
            {slide.product && (
              <Link href={`/${locale}/product/${slide.product.slug}`}>
                {t('cta_details')}
              </Link>
            )}
          </div>
        </div>

        <div className={styles.art}>
          {/* No `sizes` here: the art renders at a fixed box, and supplying a
              sizes hint made the browser request a 3840px variant of a 1100px
              source, which the optimiser was still building when the slide had
              already changed. Width-based srcset is correct for fixed art. */}
          <Image
            src={slide.image}
            alt={slide.alt}
            width={620}
            height={620}
            className={styles.artImage}
            priority={index <= 1}
          />
        </div>
      </div>

      <p className="visually-hidden" aria-live="polite">
        {`${index + 1} / ${slides.length} — ${slide.title}`}
      </p>

      <div className={styles.controls}>
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
      </div>
    </section>
  )
}
