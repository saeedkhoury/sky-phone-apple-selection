import { products } from '@/lib/catalog/products'
import type { Product } from '@/lib/catalog/types'

export type ChatIntent =
  | 'greet'
  | 'price'
  | 'product'
  | 'repair'
  | 'repair_time'
  | 'hours'
  | 'where'
  | 'phone'
  | 'delivery'
  | 'payment'
  | 'warranty'
  | 'tradein'
  | 'human'
  | 'fallback'

export interface ChatReply {
  intent: ChatIntent
  /** Translation key for the answer text. */
  messageKey: string
  /** Products to offer as cards, when the question named one. */
  products: readonly Product[]
}

/**
 * Keyword matching in all three languages. The assistant answers only from data
 * this site actually holds — catalogue prices and the shop's verified facts.
 *
 * It deliberately never quotes a repair price: the shop publishes none, so the
 * honest answer is to route the customer to a real quote.
 */
const KEYWORDS: Record<Exclude<ChatIntent, 'product' | 'fallback'>, readonly string[]> = {
  greet: ['hello', 'hi', 'hey', 'שלום', 'היי', 'مرحبا', 'اهلا', 'أهلا'],
  price: ['price', 'cost', 'how much', 'מחיר', 'כמה עולה', 'עולה', 'سعر', 'كم'],
  repair: [
    'repair', 'fix', 'broken', 'screen', 'battery', 'water', 'charging',
    'תיקון', 'לתקן', 'מסך', 'סוללה', 'מים', 'טעינה', 'שבור',
    'تصليح', 'إصلاح', 'شاشة', 'بطارية', 'ماء', 'شحن',
  ],
  repair_time: [
    'how long', 'when ready', 'time', 'כמה זמן', 'מתי מוכן', 'זמן',
    'كم يستغرق', 'متى جاهز', 'وقت',
  ],
  hours: ['hours', 'open', 'closing', 'שעות', 'פתוח', 'סגור', 'ساعات', 'مفتوح', 'دوام'],
  where: ['where', 'address', 'location', 'map', 'איפה', 'כתובת', 'מיקום', 'أين', 'عنوان', 'موقع'],
  phone: ['phone', 'call', 'whatsapp', 'number', 'טלפון', 'להתקשר', 'וואטסאפ', 'מספר', 'هاتف', 'اتصال', 'واتساب', 'رقم'],
  delivery: ['delivery', 'shipping', 'ship', 'משלוח', 'שליח', 'توصيل', 'شحن'],
  payment: ['pay', 'payment', 'credit', 'cash', 'bit', 'תשלום', 'לשלם', 'אשראי', 'מזומן', 'دفع', 'بطاقة', 'نقد'],
  warranty: ['warranty', 'guarantee', 'אחריות', 'ضمان'],
  tradein: ['trade', 'trade-in', 'old device', 'טרייד', 'מכשיר ישן', 'החלפה', 'استبدال', 'جهاز قديم'],
  human: ['human', 'agent', 'person', 'representative', 'נציג', 'אדם', 'موظف', 'شخص'],
}

const ANSWER_KEYS: Record<ChatIntent, string> = {
  greet: 'chat_a_greet',
  price: 'chat_a_price_q',
  product: 'chat_a_found',
  repair: 'chat_a_repair_q',
  repair_time: 'chat_a_repair_time',
  hours: 'chat_a_hours',
  where: 'chat_a_where',
  phone: 'chat_a_phone',
  delivery: 'chat_a_delivery',
  payment: 'chat_a_payment',
  warranty: 'chat_a_warranty',
  tradein: 'chat_a_tradein',
  human: 'chat_a_human',
  fallback: 'chat_a_fallback',
}

const MAX_PRODUCT_CARDS = 3

/** Model words too generic to identify a product on their own. */
const WEAK_NAME_WORDS = new Set([
  'pro', 'max', 'ultra', 'plus', 'air', 'mini', 'base', 'new', 'fast', 'gaming',
  'wireless', 'case', 'cable', 'charger', 'headset', 'watch', 'tab', 'book',
])

/**
 * Looks for a product *named inside* the sentence, rather than matching the
 * whole sentence as one string — a customer types "how much is the Steam Deck",
 * not "Steam Deck".
 */
function findNamedProducts(text: string): readonly Product[] {
  const full = products.filter((product) => text.includes(product.name.toLowerCase()))
  if (full.length > 0) return full.slice(0, MAX_PRODUCT_CARDS)

  // Fall back to a distinctive word from the model name, e.g. "iphone".
  const matched = products.filter((product) =>
    product.name
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length >= 4 && !WEAK_NAME_WORDS.has(word))
      .some((word) => text.includes(word)),
  )

  // A query that matches the entire catalogue is not naming anything.
  return matched.length === products.length ? [] : matched.slice(0, MAX_PRODUCT_CARDS)
}

function matches(text: string, intent: keyof typeof KEYWORDS): boolean {
  return KEYWORDS[intent].some((word) => text.includes(word))
}

export function respond(question: string): ChatReply {
  const text = question.trim().toLowerCase()

  if (text === '') {
    return { intent: 'fallback', messageKey: ANSWER_KEYS.fallback, products: [] }
  }

  // A named product beats every other intent: "how much is a Steam Deck" should
  // answer with the Steam Deck, not a generic "which product?".
  const named = findNamedProducts(text)
  if (named.length > 0) {
    return { intent: 'product', messageKey: ANSWER_KEYS.product, products: named }
  }

  // Ordered by specificity: repair_time before repair, so "how long for a screen
  // repair" gets the turnaround answer rather than "which repair?".
  const order: (keyof typeof KEYWORDS)[] = [
    'repair_time',
    'warranty',
    'tradein',
    'delivery',
    'payment',
    'hours',
    'where',
    'phone',
    'human',
    'repair',
    'price',
    'greet',
  ]

  for (const intent of order) {
    if (matches(text, intent)) {
      return { intent, messageKey: ANSWER_KEYS[intent], products: [] }
    }
  }

  return { intent: 'fallback', messageKey: ANSWER_KEYS.fallback, products: [] }
}
