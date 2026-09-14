'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { categories } from '@/lib/catalog/products'
import { getProductsByCategory } from '@/lib/catalog/query'
import { useCart } from '@/lib/cart/CartContext'
import { SearchOverlay } from './SearchOverlay'
import { CartIcon, MenuIcon, SearchIcon, CloseIcon } from './NavIcons'
import styles from './GlobalNav.module.css'

const SUPPORT_LINKS = [
  { href: '/support', label: 'Help Centre', hint: 'Guides and answers' },
  { href: '/support', label: 'Delivery', hint: 'Tracking and returns' },
  { href: '/support', label: 'Contact', hint: 'Talk to a specialist' },
]

export function GlobalNav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { itemCount, isHydrated } = useCart()
  const headerRef = useRef<HTMLElement>(null)

  const close = useCallback(() => setOpenMenu(null), [])

  // Escape closes the flyout, matching the source site's behaviour.
  useEffect(() => {
    if (!openMenu) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openMenu, close])

  // Clicking or tabbing outside the header dismisses the flyout.
  useEffect(() => {
    if (!openMenu) return
    function onFocusOut(event: FocusEvent) {
      if (!headerRef.current?.contains(event.target as Node)) close()
    }
    document.addEventListener('focusin', onFocusOut)
    return () => document.removeEventListener('focusin', onFocusOut)
  }, [openMenu, close])

  const toggle = (menu: string) => setOpenMenu((current) => (current === menu ? null : menu))

  return (
    <>
      <header ref={headerRef} className={styles.header} data-open={openMenu !== null}>
        <nav className={styles.bar} aria-label="Primary">
          <Link href="/" className={styles.brand}>
            Axiom <span className={styles.brandMark}>Store</span>
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
                  {category.name}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                className={styles.trigger}
                aria-expanded={openMenu === 'support'}
                aria-controls="flyout-support"
                onClick={() => toggle('support')}
              >
                Support
              </button>
            </li>
          </ul>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.menuButton}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
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
              type="button"
              className={styles.iconButton}
              aria-label="Search the store"
              onClick={() => {
                close()
                setIsMobileOpen(false)
                setIsSearchOpen(true)
              }}
            >
              <SearchIcon />
            </button>

            <Link href="/cart" className={styles.iconButton} aria-label={cartLabel(itemCount)}>
              <CartIcon />
              {isHydrated && itemCount > 0 && (
                <span className={styles.badge} aria-hidden="true">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {openMenu !== null && (
          <div
            className={styles.flyout}
            id={`flyout-${openMenu}`}
            onMouseLeave={close}
          >
            <div className={styles.flyoutInner}>
              {openMenu === 'support' ? (
                <div>
                  <h2 className={styles.flyoutHeading}>Support</h2>
                  {SUPPORT_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={styles.flyoutLink}
                      onClick={close}
                    >
                      {link.label}
                      <small>{link.hint}</small>
                    </Link>
                  ))}
                </div>
              ) : (
                <FlyoutCategory categoryId={openMenu} onNavigate={close} />
              )}
            </div>
          </div>
        )}
        <div className={styles.mobilePanel} id="mobile-menu" data-open={isMobileOpen}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/store/${category.id}`}
              className={styles.mobileLink}
              onClick={() => setIsMobileOpen(false)}
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/support"
            className={styles.mobileLink}
            onClick={() => setIsMobileOpen(false)}
          >
            Support
          </Link>
        </div>
      </header>

      {openMenu !== null && (
        <button
          type="button"
          className={styles.scrim}
          aria-label="Close menu"
          onClick={close}
        />
      )}

      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
    </>
  )
}

function cartLabel(count: number): string {
  if (count === 0) return 'Shopping bag, empty'
  return `Shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`
}

function FlyoutCategory({
  categoryId,
  onNavigate,
}: {
  categoryId: string
  onNavigate: () => void
}) {
  const category = categories.find((entry) => entry.id === categoryId)
  const items = getProductsByCategory(categoryId)
  if (!category) return null

  return (
    <>
      <div>
        <h2 className={styles.flyoutHeading}>Explore {category.name}</h2>
        <Link href={`/store/${category.id}`} className={styles.flyoutLink} onClick={onNavigate}>
          All {category.name}
          <small>{category.tagline}</small>
        </Link>
      </div>
      <div>
        <h2 className={styles.flyoutHeading}>Shop</h2>
        {items.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
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
