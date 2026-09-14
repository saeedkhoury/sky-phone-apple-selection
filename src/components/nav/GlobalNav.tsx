'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { categories } from '@/lib/catalog/categories'
import { getProductsByCategory } from '@/lib/catalog/query'
import { useCart } from '@/lib/cart/CartContext'
import { useLocale } from '@/lib/i18n/LocaleContext'
import { LOCALES, LOCALE_NAMES } from '@/lib/i18n/config'
import { SHOP } from '@/lib/shop'
import { SearchOverlay } from './SearchOverlay'
import { CartIcon, MenuIcon, SearchIcon, CloseIcon, GlobeIcon } from './NavIcons'
import styles from './GlobalNav.module.css'

export function GlobalNav() {
  const { locale, t } = useLocale()
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const searchTriggerRef = useRef<HTMLButtonElement>(null)
  const { itemCount, isHydrated } = useCart()

  const close = useCallback(() => setOpenMenu(null), [])

  useEffect(() => {
    if (!openMenu) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openMenu, close])

  useEffect(() => {
    if (!openMenu) return
    function onFocusOut(event: FocusEvent) {
      if (!headerRef.current?.contains(event.target as Node)) close()
    }
    document.addEventListener('focusin', onFocusOut)
    return () => document.removeEventListener('focusin', onFocusOut)
  }, [openMenu, close])

  const toggle = (menu: string) => setOpenMenu((current) => (current === menu ? null : menu))

  /** Same page, different language — keeps the visitor where they were. */
  function pathInLocale(next: string): string {
    const rest = pathname.replace(new RegExp(`^/(${LOCALES.join('|')})`), '')
    return `/${next}${rest || ''}`
  }

  return (
    <>
      <header ref={headerRef} className={styles.header} data-open={openMenu !== null}>
        <nav className={styles.bar} aria-label={t('nav_products')}>
          <Link href={`/${locale}`} className={styles.brand}>
            {SHOP.name}
          </Link>

          <ul className={styles.list}>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  type="button"
                  className={styles.trigger}
                  aria-expanded={openMenu === category.id}
                  aria-controls={`flyout-${category.id}`}
                  onClick={() => toggle(category.id)}
                >
                  {t(category.labelKey)}
                </button>
              </li>
            ))}
            <li>
              <Link href={`/${locale}/repairs`} className={styles.navLink}>
                {t('nav_repairs')}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/about`} className={styles.navLink}>
                {t('nav_about')}
              </Link>
            </li>
          </ul>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.menuButton}
              aria-label={t('filter_btn')}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
              onClick={() => {
                close()
                setIsMobileOpen((open) => !open)
              }}
            >
              {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            <button
              ref={searchTriggerRef}
              type="button"
              className={styles.iconButton}
              aria-label={t('search_ph')}
              onClick={() => {
                close()
                setIsMobileOpen(false)
                setIsSearchOpen(true)
              }}
            >
              <SearchIcon />
            </button>

            <div className={styles.langWrap}>
              <button
                type="button"
                className={styles.iconButton}
                aria-expanded={openMenu === 'lang'}
                aria-controls="lang-menu"
                aria-label={t('trust_lang_l')}
                onClick={() => toggle('lang')}
              >
                <GlobeIcon />
              </button>
              {openMenu === 'lang' && (
                <ul className={styles.langMenu} id="lang-menu">
                  {LOCALES.map((option) => (
                    <li key={option}>
                      <Link
                        href={pathInLocale(option)}
                        className={styles.langOption}
                        lang={option}
                        aria-current={option === locale}
                        onClick={close}
                      >
                        {LOCALE_NAMES[option]}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link
              href={`/${locale}/cart`}
              className={styles.iconButton}
              aria-label={`${t('nav_bag')}${isHydrated && itemCount > 0 ? ` (${itemCount})` : ''}`}
            >
              <CartIcon />
              {isHydrated && itemCount > 0 && (
                <span className={styles.badge} aria-hidden="true">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {openMenu !== null && openMenu !== 'lang' && (
          <div className={styles.flyout} id={`flyout-${openMenu}`} onMouseLeave={close}>
            <div className={styles.flyoutInner}>
              <FlyoutCategory categoryId={openMenu} onNavigate={close} />
            </div>
          </div>
        )}

        <div className={styles.mobilePanel} id="mobile-menu" data-open={isMobileOpen}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/store/${category.id}`}
              className={styles.mobileLink}
              onClick={() => setIsMobileOpen(false)}
            >
              {t(category.labelKey)}
            </Link>
          ))}
          <Link
            href={`/${locale}/repairs`}
            className={styles.mobileLink}
            onClick={() => setIsMobileOpen(false)}
          >
            {t('nav_repairs')}
          </Link>
          <Link
            href={`/${locale}/about`}
            className={styles.mobileLink}
            onClick={() => setIsMobileOpen(false)}
          >
            {t('nav_about')}
          </Link>
        </div>
      </header>

      {/* Pointer-only affordance; Escape and focus-out cover the keyboard. */}
      {openMenu !== null && openMenu !== 'lang' && (
        <button
          type="button"
          className={styles.scrim}
          tabIndex={-1}
          aria-hidden="true"
          onClick={close}
        />
      )}

      {isSearchOpen && (
        <SearchOverlay
          onClose={() => {
            setIsSearchOpen(false)
            searchTriggerRef.current?.focus()
          }}
        />
      )}
    </>
  )
}

function FlyoutCategory({
  categoryId,
  onNavigate,
}: {
  categoryId: string
  onNavigate: () => void
}) {
  const { locale, t } = useLocale()
  const category = categories.find((entry) => entry.id === categoryId)
  const items = getProductsByCategory(categoryId)
  if (!category) return null

  return (
    <>
      <div>
        <h2 className={styles.flyoutHeading}>{t(category.labelKey)}</h2>
        <Link
          href={`/${locale}/store/${category.id}`}
          className={styles.flyoutLink}
          onClick={onNavigate}
        >
          {t('filter_all')}
        </Link>
      </div>
      <div>
        <h2 className={styles.flyoutHeading}>{t('nav_products')}</h2>
        {items.slice(0, 8).map((product) => (
          <Link
            key={product.id}
            href={`/${locale}/product/${product.slug}`}
            className={styles.flyoutLink}
            onClick={onNavigate}
          >
            {product.name}
          </Link>
        ))}
      </div>
    </>
  )
}
