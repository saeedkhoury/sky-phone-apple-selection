'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { respond } from '@/lib/chat/respond'
import { useLocale } from '@/lib/i18n/LocaleContext'
import { formatPriceFor } from '@/lib/format/currency'
import { SHOP, telLink, whatsappLink } from '@/lib/shop'
import type { Product } from '@/lib/catalog/types'
import { CloseIcon } from '../nav/NavIcons'
import styles from './SupportChat.module.css'

interface Message {
  id: number
  from: 'bot' | 'user'
  text: string
  products?: readonly Product[]
}

const CHIPS = ['chat_chip_price', 'chat_chip_repair', 'chat_chip_hours', 'chat_chip_delivery']

export function SupportChat() {
  const { locale, t } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const nextId = useRef(0)
  const logRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Greet on first open, in the active language.
  useEffect(() => {
    if (!isOpen || messages.length > 0) return
    setMessages([{ id: nextId.current++, from: 'bot', text: t('chat_greet') }])
  }, [isOpen, messages.length, t])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages])

  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  function ask(question: string) {
    const text = question.trim()
    if (!text) return

    const reply = respond(text)
    setMessages((current) => [
      ...current,
      { id: nextId.current++, from: 'user', text },
      {
        id: nextId.current++,
        from: 'bot',
        text: t(reply.messageKey),
        products: reply.products,
      },
    ])
    setDraft('')
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    ask(draft)
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.launcher}
        aria-expanded={isOpen}
        aria-controls="support-chat"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <CloseIcon /> : <ChatGlyph />}
        <span className="visually-hidden">{t('chat_title')}</span>
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className={styles.panel}
          id="support-chat"
          role="dialog"
          aria-label={t('chat_title')}
        >
          <header className={styles.head}>
            <div>
              <p className={styles.title}>{t('chat_title')}</p>
              <p className={styles.sub}>{t('chat_sub')}</p>
            </div>
            <button
              type="button"
              className={styles.close}
              aria-label={t('modal_close')}
              onClick={() => {
                setIsOpen(false)
                triggerRef.current?.focus()
              }}
            >
              <CloseIcon />
            </button>
          </header>

          <div className={styles.log} ref={logRef} aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={styles.message} data-from={message.from}>
                <p className={styles.bubble}>{message.text}</p>
                {message.products && message.products.length > 0 && (
                  <ul className={styles.cards}>
                    {message.products.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/${locale}/product/${product.slug}`}
                          className={styles.card}
                          onClick={() => setIsOpen(false)}
                        >
                          <span className={styles.cardName}>{product.name}</span>
                          <span className={styles.cardPrice}>
                            {formatPriceFor(locale, product.price)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className={styles.chips}>
            {CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                className={styles.chip}
                onClick={() => ask(t(chip))}
              >
                {t(chip)}
              </button>
            ))}
          </div>

          <div className={styles.actions}>
            <a className={styles.action} href={whatsappLink(t('wa_chat_head'))} target="_blank" rel="noopener noreferrer">
              {t('chat_act_wa')}
            </a>
            <a className={styles.action} href={telLink()}>
              {t('chat_act_call')}
            </a>
          </div>

          <form className={styles.composer} onSubmit={onSubmit}>
            <label className="visually-hidden" htmlFor="chat-input">
              {t('chat_ph')}
            </label>
            <input
              id="chat-input"
              className={styles.input}
              value={draft}
              placeholder={t('chat_ph')}
              onChange={(event) => setDraft(event.target.value)}
            />
            <button type="submit" className={styles.send} disabled={!draft.trim()}>
              {t('add')}
            </button>
          </form>

          <p className={styles.footnote}>{SHOP.phone}</p>
        </div>
      )}
    </>
  )
}

function ChatGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12a8 8 0 1 1-3.2-6.4M21 4v5h-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
