import type { Metadata } from 'next'
import { GlobalNav } from '@/components/nav/GlobalNav'
import { GlobalFooter } from '@/components/footer/GlobalFooter'
import { CartProvider } from '@/lib/cart/CartContext'
import { THEME_INIT_SCRIPT } from '@/lib/theme/themeStore'
import './globals.css'

export const metadata: Metadata = {
  title: 'Axiom Store',
  description: 'Laptops, phones, audio and displays, built for people who build things.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        {/* Applies the stored theme before first paint, so there is no flash
            of the wrong palette on load. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <CartProvider>
          <a href="#main" className="visually-hidden">
            Skip to main content
          </a>
          <GlobalNav />
          <main id="main">{children}</main>
          <GlobalFooter />
        </CartProvider>
      </body>
    </html>
  )
}
