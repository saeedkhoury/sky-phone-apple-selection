import Image from 'next/image'
import { assetPath } from '@/lib/asset-path'
import { notFound } from 'next/navigation'
import { LOCALES, isLocale, translate } from '@/lib/i18n/config'
import { SHOP, mapsLink, telLink, whatsappLink } from '@/lib/shop'
import styles from './page.module.css'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params
  if (!isLocale(locale)) return { title: SHOP.name }
  return {
    title: `${translate(locale, 'ab_title')} — ${SHOP.name}`,
    description: translate(locale, 'ab_lead'),
  }
}

export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = (key: string) => translate(locale, key)

  const facts = [
    { label: t('ab_phone_l'), value: SHOP.phone, href: telLink() },
    { label: t('ab_wa_l'), value: SHOP.phone, href: whatsappLink(t('wa_contact_head')) },
    { label: t('ab_addr_l'), value: t('ab_addr_v'), href: mapsLink() },
    { label: t('ab_hours_l'), value: t('ab_hours_v') },
  ]

  const faqs = [
    { q: 'faq1_q', a: 'faq1_a' },
    { q: 'faq2_q', a: 'faq2_a' },
    { q: 'faq3_q', a: 'faq3_a' },
    { q: 'faq4_q', a: 'faq4_a' },
  ]

  return (
    <>
      <header className={`container ${styles.hero}`}>
        <Image src={assetPath('/logo.png')} alt={SHOP.name} width={72} height={72} className={styles.logo} />
        <h1 className={styles.title}>{t('ab_title')}</h1>
        <p className={styles.lead}>{t('ab_lead')}</p>
      </header>

      <section className="container container--narrow section" aria-labelledby="story">
        <h2 id="story" className={styles.sectionTitle}>
          {t('ab_story_h')}
        </h2>
        <p className={styles.copy}>{t('ab_story_p1')}</p>
        <p className={styles.copy}>{t('ab_story_p2')}</p>

        <ul className={styles.stats}>
          <li className={styles.stat}>
            <span className={styles.statValue}>{SHOP.established}</span>
            <span className={styles.statLabel}>{t('ab_stat1')}</span>
          </li>
          <li className={styles.stat}>
            <span className={styles.statValue}>{t('trust_lang_n')}</span>
            <span className={styles.statLabel}>{t('ab_stat2')}</span>
          </li>
          <li className={styles.stat}>
            <span className={styles.statValue}>{t('trust_ig_n')}</span>
            <span className={styles.statLabel}>{t('trust_ig_l')}</span>
          </li>
        </ul>
      </section>

      <section className="container container--narrow section" aria-labelledby="contact">
        <h2 id="contact" className={styles.sectionTitle}>
          {t('ab_contact_h')}
        </h2>
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt className={styles.factLabel}>{fact.label}</dt>
              <dd className={styles.factValue}>
                {fact.href ? (
                  <a href={fact.href} target="_blank" rel="noopener noreferrer">
                    {fact.value}
                  </a>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className={styles.socials}>
          <a href={SHOP.instagram} target="_blank" rel="noopener noreferrer">
            {SHOP.instagramHandle}
          </a>
          <a href={SHOP.facebook} target="_blank" rel="noopener noreferrer">
            {t('social_facebook')}
          </a>
        </div>
      </section>

      <section className="container container--narrow section" aria-labelledby="faq">
        <h2 id="faq" className={styles.sectionTitle}>
          {t('ab_faq_h')}
        </h2>
        {faqs.map((faq) => (
          <details key={faq.q} className={styles.faq}>
            <summary className={styles.faqQ}>{t(faq.q)}</summary>
            <p className={styles.faqA}>{t(faq.a)}</p>
          </details>
        ))}
      </section>
    </>
  )
}
