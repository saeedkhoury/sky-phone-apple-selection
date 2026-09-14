import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n/config'

/**
 * Every page lives under /:locale. This sends bare paths to a language:
 * whichever of the shop's three the visitor's browser prefers, else Hebrew.
 */
function preferredLocale(request: NextRequest): string {
  const header = request.headers.get('accept-language') ?? ''
  const wanted = header
    .split(',')
    .map((part) => part.split(';')[0].trim().toLowerCase())

  for (const tag of wanted) {
    const base = tag.split('-')[0]
    const match = LOCALES.find((locale) => locale === base)
    if (match) return match
  }
  return DEFAULT_LOCALE
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (hasLocale) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/${preferredLocale(request)}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Skip static assets and Next internals; only real pages get redirected.
  matcher: ['/((?!_next|img|video|api|.*\\.).*)'],
}
