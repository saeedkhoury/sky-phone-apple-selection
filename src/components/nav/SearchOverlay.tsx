'use client'

import Link from 'next/link'
import Image from 'next/image'
import { assetPath } from '@/lib/asset-path'
import { useEffect, useMemo, useRef, useState } from 'react'
import { products } from '@/lib/catalog/products'
import { searchProducts } from '@/lib/catalog/query'
import { formatPriceFor } from '@/lib/format/currency'
import { useLocale } from '@/lib/i18n/LocaleContext'
import { CloseIcon, SearchIcon } from './NavIcons'
import styles from './SearchOverlay.module.css'

const MAX_RESULTS = 8
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const { locale, t } = useLocale()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // aria-modal alone does not stop Tab reaching the page behind the dialog.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => element.offsetParent !== null)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const results = useMemo(
    () => searchProducts(products, query, locale).slice(0, MAX_RESULTS),
    [query, locale],
  )

  const isSearching = query.trim().length > 0

  return (
    <div
      ref={dialogRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={t('search_ph')}
    >
      <div className={styles.bar}>
        <div className={styles.inputWrap}>
          <SearchIcon />
          <input
            ref={inputRef}
            className={styles.input}
            type="search"
            placeholder={t('search_ph')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label={t('search_ph')}
          />
        </div>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={t('modal_close')}
        >
          <CloseIcon />
        </button>
      </div>

      <div className={styles.results}>
        {isSearching && results.length === 0 ? (
          <>
            <h2 className={styles.heading}>{t('search_empty_h')}</h2>
            <p className={styles.empty}>{t('search_empty_p')}</p>
          </>
        ) : (
          <ul>
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/${locale}/product/${product.slug}`}
                  className={styles.result}
                  onClick={onClose}
                >
                  <Image
                    src={assetPath(product.image)}
                    alt=""
                    width={48}
                    height={48}
                    className={styles.thumb}
                  />
                  <span>
                    <span className={styles.resultName}>{product.name}</span>
                    <br />
                    <span className={styles.resultMeta}>
                      {formatPriceFor(locale, product.price)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
