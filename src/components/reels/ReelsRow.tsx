'use client'

import { useRef } from 'react'
import { assetPath } from '@/lib/asset-path'
import { translate, type Locale } from '@/lib/i18n/config'
import { SHOP } from '@/lib/shop'
import styles from './ReelsRow.module.css'

/** The shop's own clips, served locally rather than embedded from a platform. */
const REELS = [
  { src: '/video/reel1.mp4', poster: '/video/reel1-poster.jpg' },
  { src: '/video/reel2.mp4', poster: '/video/reel2-poster.jpg' },
  { src: '/video/reel3.mp4', poster: '/video/reel3-poster.jpg' },
  { src: '/video/reel4.mp4', poster: '/video/reel4-poster.jpg' },
] as const

export function ReelsRow({ locale }: { locale: Locale }) {
  const t = (key: string) => translate(locale, key)
  const rowRef = useRef<HTMLUListElement>(null)

  return (
    <section className="container section">
      <header className={styles.head}>
        <div>
          <h2 className={styles.title}>{t('reels_head')}</h2>
          <p className={styles.sub}>{t('reels_sub')}</p>
        </div>
        <a href={SHOP.instagram} target="_blank" rel="noopener noreferrer">
          {SHOP.instagramHandle} ›
        </a>
      </header>

      <ul className={styles.row} ref={rowRef}>
        {REELS.map((reel, index) => (
          <li key={reel.src} className={styles.item}>
            <video
              className={styles.video}
              src={assetPath(reel.src)}
              poster={assetPath(reel.poster)}
              controls
              preload="none"
              playsInline
              aria-label={`${t('reels_head')} ${index + 1}`}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
