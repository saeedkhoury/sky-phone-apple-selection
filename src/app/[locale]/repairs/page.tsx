import { notFound } from 'next/navigation'
import { repairServices } from '@/lib/repairs/repairs'
import { RepairIcon } from '@/components/repairs/RepairIcon'
import { Button } from '@/components/ui/Button'
import { LOCALES, isLocale, translate } from '@/lib/i18n/config'
import { SHOP, telLink, whatsappLink } from '@/lib/shop'
import styles from './page.module.css'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/repairs'>) {
  const { locale } = await params
  if (!isLocale(locale)) return { title: SHOP.name }
  return {
    title: `${translate(locale, 'rp_title')} — ${SHOP.name}`,
    description: translate(locale, 'rp_sub'),
  }
}

export default async function RepairsPage({ params }: PageProps<'/[locale]/repairs'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = (key: string) => translate(locale, key)
  const steps = [
    { h: 'step1_h', p: 'step1_p' },
    { h: 'step2_h', p: 'step2_p' },
    { h: 'step3_h', p: 'step3_p' },
  ]

  return (
    <>
      <header className={`container ${styles.hero}`}>
        <h1 className={styles.title}>{t('rp_title')}</h1>
        <p className={styles.lead}>{t('rp_sub')}</p>
        <div className={styles.heroActions}>
          <Button href={whatsappLink(t('wa_chat_head'))} large>
            {t('ask_wa')}
          </Button>
          <Button href={telLink()} variant="secondary" large>
            {t('chat_act_call')}
          </Button>
        </div>
      </header>

      <section className="container section" aria-labelledby="services-heading">
        <h2 id="services-heading" className={styles.sectionTitle}>
          {t('rp_services_head')}
        </h2>
        {/*
          No prices here by the owner's decision: the shop quotes after it has
          seen the device, so each service routes to a real conversation.
        */}
        <ul className={styles.services}>
          {repairServices.map((service) => (
            <li key={service.id} className={styles.service}>
              <span className={styles.serviceIcon}>
                <RepairIcon name={service.icon} />
              </span>
              <h3 className={styles.serviceName}>{t(service.labelKey)}</h3>
              <a
                className={styles.serviceCta}
                href={whatsappLink(`${t('wa_chat_head')} ${t(service.labelKey)}`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('ask_wa')} ›
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.steps}>
        <div className="container">
          <ol className={styles.stepList}>
            {steps.map((step, index) => (
              <li key={step.h} className={styles.step}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <h3 className={styles.stepTitle}>{t(step.h)}</h3>
                <p className={styles.stepCopy}>{t(step.p)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
