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

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function SupportChat() {
  const { locale, t } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const nextId = useRef(0)
  const logRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Greet on first open, in the active language.
  useEffect(() => {
    if (!isOpen || messages.length > 0) return
    setMessages([{ id: nextId.current++, from: 'bot', text: t('chat_greet') }])
  }, [isOpen, messages.length, t])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages])

  // Opening the panel must move focus into it, or a keyboard user has to tab
  // through the whole page to reach the dialog they just opened.
  useEffect(() => {
    if (!isOpen) return
    inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      // aria-modal alone does not stop Tab reaching the page behind the panel.
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
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
      <a
        className={styles.whatsapp}
        href={whatsappLink(t('wa_contact_head'))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('chat_act_wa')}
        title={t('chat_act_wa')}
        data-contact="whatsapp"
      >
        <WhatsAppGlyph />
      </a>
      <button
        ref={triggerRef}
        type="button"
        className={styles.launcher}
        aria-expanded={isOpen}
        aria-controls="support-chat"
        title={t('chat_title')}
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
              ref={inputRef}
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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5a9.5 9.5 0 0 1 19 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="11.5" r="1" fill="currentColor" />
      <circle cx="11.5" cy="11.5" r="1" fill="currentColor" />
      <circle cx="15.5" cy="11.5" r="1" fill="currentColor" />
    </svg>
  )
}

function WhatsAppGlyph() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.5 11.8a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.3-4.6a8.5 8.5 0 1 1 16.2-4.1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m8.1 7.4 1.2-.2 1.1 2.6-.9 1.1a7.1 7.1 0 0 0 3.5 3.1l1-1 2.5 1.2-.1 1.2c-.1 1-1.1 1.5-2.1 1.3-4.4-.9-7.3-3.8-7.6-7.3-.1-.9.5-1.7 1.4-2Z"
        fill="currentColor"
      />
    </svg>
  )
}
