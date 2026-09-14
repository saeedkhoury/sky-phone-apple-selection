import Link from 'next/link'
import { repairServices } from '@/lib/repairs/repairs'
import { translate, type Locale } from '@/lib/i18n/config'
import { RepairIcon } from './RepairIcon'
import styles from './RepairStrip.module.css'

/**
 * Repair promo band. Shows what the shop fixes, deliberately without prices —
 * the owner asked for quotes to come from a conversation, not a price list.
 */
export function RepairStrip({ locale }: { locale: Locale }) {
  const t = (key: string) => translate(locale, key)

  return (
    <section className={styles.strip}>
      <div className="container">
        <div className={styles.head}>
          <h2 className={styles.title}>{t('rp_title')}</h2>
          <p className={styles.sub}>{t('rp_sub')}</p>
        </div>

        <ul className={styles.services}>
          {repairServices.map((service) => (
            <li key={service.id} className={styles.service}>
              <span className={styles.icon}>
                <RepairIcon name={service.icon} />
              </span>
              <span className={styles.serviceName}>{t(service.labelKey)}</span>
            </li>
          ))}
        </ul>

        <div className={styles.cta}>
          <Link href={`/${locale}/repairs`} className={styles.ctaLink}>
            {t('rp_title')} ›
          </Link>
        </div>
      </div>
    </section>
  )
}
