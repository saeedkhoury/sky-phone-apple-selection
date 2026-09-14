import Image from 'next/image'
import { translate, type Locale } from '@/lib/i18n/config'
import { SHOP } from '@/lib/shop'
import styles from './AppSplash.module.css'

/**
 * Shown over the page on first paint and fades itself out. Server-rendered so
 * it is in the initial HTML with no client work, and aria-hidden because it is
 * decorative — a screen-reader user should land on the real page, not a splash.
 */
export function AppSplash({ locale }: { locale: Locale }) {
  return (
    <div className={styles.splash} aria-hidden="true">
      <div className={styles.stack}>
        <div className={styles.markWrap}>
          <span className={styles.halo} />
          <Image
            src="/logo.png"
            alt=""
            width={80}
            height={80}
            className={styles.mark}
            priority
          />
        </div>
        <p className={styles.name}>{SHOP.name}</p>
        <p className={styles.est}>{translate(locale, 'foot_est')}</p>
      </div>
    </div>
  )
}
