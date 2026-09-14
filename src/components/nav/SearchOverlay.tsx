'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { products } from '@/lib/catalog/products'
import { searchProducts } from '@/lib/catalog/query'
import { ProductArt } from '@/components/product/ProductArt'
import { formatPrice } from '@/lib/format/currency'
import { CloseIcon, SearchIcon } from './NavIcons'
import styles from './SearchOverlay.module.css'

const MAX_RESULTS = 8

interface SearchOverlayProps {
  onClose: () => void
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // The parent unmounts this component on close, so state resets by itself and
  // we only need to move focus into the field on open.
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  // Lock background scroll while the takeover is up.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const results = useMemo(
    () => searchProducts(products, query).slice(0, MAX_RESULTS),
    [query],
  )

  const isSearching = query.trim().length > 0

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Search">
      <div className={styles.bar}>
        <div className={styles.inputWrap}>
          <SearchIcon />
          <input
            ref={inputRef}
            className={styles.input}
            type="search"
            placeholder="Search the store"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search products"
          />
        </div>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close search">
          <CloseIcon />
        </button>
      </div>

      <div className={styles.results}>
        <h2 className={styles.heading}>
          {isSearching ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Popular'}
        </h2>

        {isSearching && results.length === 0 ? (
          <p className={styles.empty}>
            No products match “{query.trim()}”. Try a different search.
          </p>
        ) : (
          <ul>
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/product/${product.slug}`}
                  className={styles.result}
                  onClick={onClose}
                >
                  <ProductArt
                    categoryId={product.categoryId}
                    swatch={product.variants[0].swatch}
                    className={styles.thumb}
                  />
                  <span>
                    <span className={styles.resultName}>{product.name}</span>
                    <span className={styles.resultMeta}>
                      {' '}
                      · From {formatPrice(product.variants[0].price)}
                    </span>
                    <br />
                    <span className={styles.resultMeta}>{product.tagline}</span>
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
