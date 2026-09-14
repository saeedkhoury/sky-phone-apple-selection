import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GlobalNav } from '@/components/nav/GlobalNav'
import { GlobalFooter } from '@/components/footer/GlobalFooter'
import { SupportChat } from '@/components/chat/SupportChat'
import { CartProvider } from '@/lib/cart/CartContext'
import { LocaleProvider } from '@/lib/i18n/LocaleContext'
import {
  LOCALES,
  LOCALE_TAGS,
  directionFor,
  isLocale,
  translate,
} from '@/lib/i18n/config'
import { THEME_INIT_SCRIPT } from '@/lib/theme/themeStore'
import { SHOP } from '@/lib/shop'
import '../globals.css'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  return {
    title: `${SHOP.name} — ${translate(locale, 'nav_products')}`,
    description: translate(locale, 'ab_lead'),
    icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
    openGraph: {
      title: SHOP.name,
      description: translate(locale, 'ab_lead'),
      images: ['/og-image.jpg'],
    },
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dir = directionFor(locale)

  // suppressHydrationWarning covers this element's own attributes: the theme
  // script below rewrites data-theme before React hydrates.
  return (
    <html lang={LOCALE_TAGS[locale]} dir={dir} data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <LocaleProvider locale={locale}>
          <CartProvider>
            <a href="#main" className="skip-link">
              {translate(locale, 'skip_main')}
            </a>
            <GlobalNav />
            <main id="main">{children}</main>
            <GlobalFooter />
            <SupportChat />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
