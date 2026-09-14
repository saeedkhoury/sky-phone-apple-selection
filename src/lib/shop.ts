/**
 * Sky Phone's real, verified details, checked against the shop's own public
 * Instagram (@skyphone.ca) in September 2026. Do not replace these with
 * placeholders — they are what a customer will actually dial and drive to.
 */
export const SHOP = {
  name: 'Sky Phone',
  established: 2010,
  phone: '052-722-3916',
  /** International form, for tel: and wa.me links. */
  phoneE164: '972527223916',
  /** Full verified form, matching the shop's own records. */
  address: 'Kafr Kanna, Main Street (Wadi al-Hai road)',
  instagram: 'https://instagram.com/skyphone.ca',
  instagramHandle: '@skyphone.ca',
  instagramFollowers: '54.2K',
  /** The business Page, not the owner's personal profile. */
  facebook: 'https://facebook.com/skyphone.ca',
  currency: '₪',
} as const

export function whatsappLink(message: string): string {
  return `https://wa.me/${SHOP.phoneE164}?text=${encodeURIComponent(message)}`
}

export function telLink(): string {
  return `tel:+${SHOP.phoneE164}`
}

export function mapsLink(): string {
  return `https://maps.google.com/?q=${encodeURIComponent(`${SHOP.name} ${SHOP.address}`)}`
}
