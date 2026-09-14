import Image from 'next/image'
import { translate, type Locale } from '@/lib/i18n/config'
import { SHOP } from '@/lib/shop'
import styles from './BrandLoader.module.css'

/**
 * Full-screen loading state. Server-rendered so it paints immediately, with no
 * client JavaScript needed before it appears.
 */
export function BrandLoader({ locale }: { locale?: Locale }) {
  return (
    <div className={styles.screen} role="status" aria-live="polite">
      <div className={styles.stack}>
        <div className={styles.markWrap}>
          <span className={styles.halo} aria-hidden="true" />
          <Image
            src="/logo.png"
            alt=""
            width={76}
            height={76}
            className={styles.mark}
            priority
          />
        </div>
        <p className={styles.name}>{SHOP.name}</p>
        <p className={styles.tagline}>
          {locale ? translate(locale, 'foot_est') : `EST ${SHOP.established}`}
        </p>
      </div>
    </div>
  )
}
