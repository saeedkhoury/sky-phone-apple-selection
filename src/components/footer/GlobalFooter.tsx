'use client'

import Link from 'next/link'
import { useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { categories } from '@/lib/catalog/products'
import { useTheme, type Theme } from '@/lib/theme/ThemeContext'
import { ChevronIcon } from '../nav/NavIcons'
import styles from './GlobalFooter.module.css'

interface FooterColumn {
  title: string
  links: readonly { label: string; href: string }[]
}

const STATIC_COLUMNS: readonly FooterColumn[] = [
  {
    title: 'Shop',
    links: [
      { label: 'Store home', href: '/store/all' },
      { label: 'Trade in', href: '/support' },
      { label: 'Financing', href: '/support' },
      { label: 'Order status', href: '/support' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Centre', href: '/support' },
      { label: 'Delivery & pickup', href: '/support' },
      { label: 'Returns', href: '/support' },
      { label: 'Contact us', href: '/support' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Your bag', href: '/cart' },
      { label: 'Saved items', href: '/cart' },
      { label: 'Preferences', href: '/support' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Axiom', href: '/support' },
      { label: 'Newsroom', href: '/support' },
      { label: 'Careers', href: '/support' },
      { label: 'Sustainability', href: '/support' },
    ],
  },
]

const THEME_OPTIONS: readonly { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
]

export function GlobalFooter() {
  const { theme, setTheme } = useTheme()
  const [openColumn, setOpenColumn] = useState<string | null>(null)

  /**
   * Light/Dark/Auto is a single choice among three, so it is a radio group, not
   * three independent toggles. That means roving tabindex plus arrow-key
   * movement between options.
   */
  function onThemeKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']
    if (!keys.includes(event.key)) return

    event.preventDefault()
    const current = THEME_OPTIONS.findIndex((option) => option.value === theme)
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1
    const next = (current + step + THEME_OPTIONS.length) % THEME_OPTIONS.length

    setTheme(THEME_OPTIONS[next].value)
    event.currentTarget
      .querySelectorAll<HTMLButtonElement>('[role="radio"]')
      [next]?.focus()
  }

  const columns: readonly FooterColumn[] = [
    {
      title: 'Products',
      links: categories.map((category) => ({
        label: category.name,
        href: `/store/${category.id}`,
      })),
    },
    ...STATIC_COLUMNS,
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          {columns.map((column) => {
            const isOpen = openColumn === column.title
            return (
              <div key={column.title} className={styles.column}>
                <h2 className={styles.columnTitle}>{column.title}</h2>

                <button
                  type="button"
                  className={styles.accordionToggle}
                  aria-expanded={isOpen}
                  aria-controls={`footer-${column.title}`}
                  onClick={() => setOpenColumn(isOpen ? null : column.title)}
                >
                  {column.title}
                  <ChevronIcon />
                </button>

                {/* Always rendered; CSS collapses it below 833px when closed,
                    so there is no window read during render. */}
                <div
                  className={styles.panel}
                  id={`footer-${column.title}`}
                  data-open={isOpen}
                >
                  {column.links.map((link) => (
                    <Link key={link.label} href={link.href} className={styles.columnLink}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className={styles.base}>
          <div className={styles.legal}>
            <span>Copyright © {new Date().getFullYear()} Axiom Store. All rights reserved.</span>
            <Link href="/support" className={styles.columnLink}>
              Privacy Policy
            </Link>
            <Link href="/support" className={styles.columnLink}>
              Terms of Use
            </Link>
          </div>

          <div
            className={styles.themeToggle}
            role="radiogroup"
            aria-label="Colour theme"
            onKeyDown={onThemeKeyDown}
          >
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                className={styles.themeOption}
                aria-checked={theme === option.value}
                tabIndex={theme === option.value ? 0 : -1}
                onClick={() => setTheme(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <p className={styles.disclaimer}>
          Axiom is a fictional demonstration store. Product names, specifications and prices are
          illustrative and nothing sold here is real.
        </p>
      </div>
    </footer>
  )
}
