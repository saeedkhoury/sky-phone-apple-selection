import type { Category, Product } from './types'

/**
 * Placeholder catalog for the "Axiom" store. Swap the brand name, copy and
 * prices for your own; the shape is what the rest of the app depends on.
 */

export const categories: readonly Category[] = [
  {
    id: 'laptops',
    name: 'Laptops',
    tagline: 'Desktop-class power, anywhere.',
    gradient: ['#1c1c3a', '#0a0a18'],
  },
  {
    id: 'phones',
    name: 'Phones',
    tagline: 'The pocket flagship, reimagined.',
    gradient: ['#3a1c2e', '#150a12'],
  },
  {
    id: 'audio',
    name: 'Audio',
    tagline: 'Sound that disappears around you.',
    gradient: ['#123037', '#06161a'],
  },
  {
    id: 'displays',
    name: 'Displays',
    tagline: 'Colour you can trust.',
    gradient: ['#2a2140', '#100c19'],
  },
  {
    id: 'accessories',
    name: 'Accessories',
    tagline: 'The details that finish the setup.',
    gradient: ['#2d2a1e', '#12110b'],
  },
] as const

export const products: readonly Product[] = [
  {
    id: 'aero-15-pro',
    slug: 'aero-15-pro',
    name: 'Aero 15 Pro',
    tagline: 'Studio power in a 1.4 kg chassis.',
    description:
      'The Aero 15 Pro pairs a 12-core processor with a 120 Hz mini-LED display and a vapour chamber that stays silent under sustained load. Built for compiling, colour grading and everything in between.',
    categoryId: 'laptops',
    badge: 'New',
    featured: true,
    variants: [
      { id: 'space-black-512', name: 'Space Black · 512GB', price: 199900, swatch: '#2b2b2f' },
      { id: 'space-black-1tb', name: 'Space Black · 1TB', price: 249900, swatch: '#2b2b2f' },
      { id: 'silver-1tb', name: 'Silver · 1TB', price: 249900, swatch: '#d8d8dc' },
    ],
    specs: [
      { label: 'Display', value: '15.3" mini-LED, 120 Hz, 1600 nits' },
      { label: 'Chip', value: 'Axiom M-series, 12-core CPU / 18-core GPU' },
      { label: 'Memory', value: '24GB unified' },
      { label: 'Battery', value: 'Up to 20 hours' },
      { label: 'Ports', value: '3× USB-C, HDMI, SDXC' },
      { label: 'Weight', value: '1.4 kg' },
    ],
  },
  {
    id: 'aero-13-air',
    slug: 'aero-13-air',
    name: 'Aero 13 Air',
    tagline: 'Impossibly thin. Genuinely fast.',
    description:
      'At 11 mm closed, the Aero 13 Air is the lightest machine we make — and still runs a full development toolchain without a fan.',
    categoryId: 'laptops',
    featured: true,
    variants: [
      { id: 'midnight-256', name: 'Midnight · 256GB', price: 109900, swatch: '#1f2430' },
      { id: 'midnight-512', name: 'Midnight · 512GB', price: 129900, swatch: '#1f2430' },
      { id: 'starlight-512', name: 'Starlight · 512GB', price: 129900, swatch: '#efe7da' },
    ],
    specs: [
      { label: 'Display', value: '13.6" Liquid Retina, 500 nits' },
      { label: 'Chip', value: 'Axiom M-series, 8-core CPU / 10-core GPU' },
      { label: 'Memory', value: '16GB unified' },
      { label: 'Battery', value: 'Up to 18 hours' },
      { label: 'Weight', value: '1.08 kg' },
    ],
  },
  {
    id: 'aero-16-max',
    slug: 'aero-16-max',
    name: 'Aero 16 Max',
    tagline: 'For work that will not wait.',
    description:
      'Sixteen inches of mini-LED, up to 128GB of unified memory, and thermals engineered for eight-hour renders.',
    categoryId: 'laptops',
    variants: [
      { id: 'black-2tb', name: 'Space Black · 2TB', price: 379900, swatch: '#2b2b2f' },
      { id: 'black-4tb', name: 'Space Black · 4TB', price: 459900, swatch: '#2b2b2f' },
    ],
    specs: [
      { label: 'Display', value: '16.2" mini-LED, 120 Hz' },
      { label: 'Chip', value: 'Axiom M-series Max, 16-core CPU' },
      { label: 'Memory', value: 'Up to 128GB unified' },
      { label: 'Battery', value: 'Up to 22 hours' },
      { label: 'Weight', value: '2.15 kg' },
    ],
  },
  {
    id: 'vertex-pro',
    slug: 'vertex-pro',
    name: 'Vertex Pro',
    tagline: 'Titanium. Featherweight. Relentless.',
    description:
      'A grade-5 titanium frame, a 48MP main sensor and an always-on display that sips power. The most capable phone we have built.',
    categoryId: 'phones',
    badge: 'New',
    featured: true,
    variants: [
      { id: 'titanium-256', name: 'Natural Titanium · 256GB', price: 119900, swatch: '#8d8478' },
      { id: 'titanium-512', name: 'Natural Titanium · 512GB', price: 139900, swatch: '#8d8478' },
      { id: 'blue-256', name: 'Deep Blue · 256GB', price: 119900, swatch: '#2c4257' },
    ],
    specs: [
      { label: 'Display', value: '6.3" OLED, 120 Hz, 2000 nits' },
      { label: 'Camera', value: '48MP main · 12MP ultra-wide · 12MP 5× tele' },
      { label: 'Chip', value: 'Axiom A-series' },
      { label: 'Battery', value: 'Up to 29 hours video' },
      { label: 'Material', value: 'Grade-5 titanium' },
    ],
  },
  {
    id: 'vertex',
    slug: 'vertex',
    name: 'Vertex',
    tagline: 'Everything you need. Nothing you do not.',
    description:
      'The same silicon and the same main camera as the Pro, in an aluminium body at a friendlier price.',
    categoryId: 'phones',
    variants: [
      { id: 'black-128', name: 'Black · 128GB', price: 79900, swatch: '#25262a' },
      { id: 'white-256', name: 'White · 256GB', price: 89900, swatch: '#f1f1f3' },
      { id: 'green-256', name: 'Sage · 256GB', price: 89900, swatch: '#5d7360' },
    ],
    specs: [
      { label: 'Display', value: '6.1" OLED, 120 Hz' },
      { label: 'Camera', value: '48MP main · 12MP ultra-wide' },
      { label: 'Chip', value: 'Axiom A-series' },
      { label: 'Battery', value: 'Up to 24 hours video' },
    ],
  },
  {
    id: 'pulse-buds-pro',
    slug: 'pulse-buds-pro',
    name: 'Pulse Buds Pro',
    tagline: 'Silence, on demand.',
    description:
      'Adaptive noise cancellation that reads the room 48,000 times a second, with spatial audio that tracks your head.',
    categoryId: 'audio',
    featured: true,
    variants: [
      { id: 'white', name: 'White', price: 24900, swatch: '#f4f4f6' },
      { id: 'graphite', name: 'Graphite', price: 24900, swatch: '#3a3a3e' },
    ],
    specs: [
      { label: 'Noise control', value: 'Adaptive ANC · Transparency' },
      { label: 'Battery', value: '7 h buds · 32 h with case' },
      { label: 'Audio', value: 'Spatial audio with head tracking' },
      { label: 'Resistance', value: 'IPX4' },
    ],
  },
  {
    id: 'pulse-studio',
    slug: 'pulse-studio',
    name: 'Pulse Studio',
    tagline: 'Over-ear. Over-engineered.',
    description:
      'Forty-millimetre drivers, memory-foam cups and a machined aluminium yoke. Forty hours between charges.',
    categoryId: 'audio',
    variants: [
      { id: 'midnight', name: 'Midnight', price: 39900, swatch: '#1c1f27' },
      { id: 'sand', name: 'Desert Sand', price: 39900, swatch: '#cbb9a2' },
    ],
    specs: [
      { label: 'Drivers', value: '40 mm dynamic' },
      { label: 'Battery', value: 'Up to 40 hours' },
      { label: 'Noise control', value: 'Hybrid ANC' },
      { label: 'Weight', value: '385 g' },
    ],
  },
  {
    id: 'pulse-speaker',
    slug: 'pulse-speaker',
    name: 'Pulse Speaker',
    tagline: 'Room-filling, room-aware.',
    description:
      'Beam-forming tweeters map the acoustics of the room and adjust in real time.',
    categoryId: 'audio',
    variants: [
      { id: 'charcoal', name: 'Charcoal', price: 29900, swatch: '#33353b' },
      { id: 'chalk', name: 'Chalk', price: 29900, swatch: '#e9e7e2' },
    ],
    specs: [
      { label: 'Drivers', value: '1 woofer · 5 tweeters' },
      { label: 'Room sensing', value: 'Real-time acoustic mapping' },
      { label: 'Connectivity', value: 'Wi-Fi 6E · Bluetooth 5.3' },
    ],
  },
  {
    id: 'clarity-5k',
    slug: 'clarity-5k',
    name: 'Clarity 5K',
    tagline: 'Reference colour, on your desk.',
    description:
      'A 27-inch 5K panel calibrated at the factory to Delta-E under 1, with a nano-texture option for bright rooms.',
    categoryId: 'displays',
    featured: true,
    variants: [
      { id: 'standard', name: 'Standard glass', price: 159900, swatch: '#2f3138' },
      { id: 'nano', name: 'Nano-texture glass', price: 189900, swatch: '#4a4d55' },
    ],
    specs: [
      { label: 'Panel', value: '27" 5K Retina, 218 ppi' },
      { label: 'Brightness', value: '600 nits' },
      { label: 'Colour', value: 'P3 wide gamut, Delta-E < 1' },
      { label: 'Connectivity', value: 'Thunderbolt 4, 96W passthrough' },
    ],
  },
  {
    id: 'clarity-32-xdr',
    slug: 'clarity-32-xdr',
    name: 'Clarity 32 XDR',
    tagline: 'The grading suite, condensed.',
    description:
      'Thirty-two inches of 6K mini-LED with 1600 nits sustained and per-zone local dimming.',
    categoryId: 'displays',
    variants: [
      { id: 'xdr-standard', name: 'Standard glass', price: 499900, swatch: '#26282e' },
      { id: 'xdr-nano', name: 'Nano-texture glass', price: 549900, swatch: '#44474f' },
    ],
    specs: [
      { label: 'Panel', value: '32" 6K mini-LED' },
      { label: 'Brightness', value: '1000 nits sustained · 1600 peak' },
      { label: 'Contrast', value: '1,000,000:1' },
      { label: 'Colour', value: 'Reference modes, P3 / Rec.709' },
    ],
  },
  {
    id: 'orbit-keyboard',
    slug: 'orbit-keyboard',
    name: 'Orbit Keyboard',
    tagline: 'Low profile. High feedback.',
    description:
      'Scissor-switch keys with 1.2 mm of travel, a machined aluminium deck and a month of battery.',
    categoryId: 'accessories',
    variants: [
      { id: 'black', name: 'Black', price: 17900, swatch: '#2a2b30' },
      { id: 'silver', name: 'Silver', price: 17900, swatch: '#d5d6da' },
    ],
    specs: [
      { label: 'Switches', value: 'Scissor, 1.2 mm travel' },
      { label: 'Battery', value: 'Up to 1 month' },
      { label: 'Connectivity', value: 'Bluetooth 5.3 · USB-C' },
    ],
  },
  {
    id: 'orbit-mouse',
    slug: 'orbit-mouse',
    name: 'Orbit Mouse',
    tagline: 'A surface that reads intent.',
    description:
      'A single continuous glass surface tracks gestures across its full width, with no moving parts.',
    categoryId: 'accessories',
    variants: [
      { id: 'black-mouse', name: 'Black', price: 9900, swatch: '#2a2b30' },
      { id: 'silver-mouse', name: 'Silver', price: 9900, swatch: '#d5d6da' },
    ],
    specs: [
      { label: 'Surface', value: 'Continuous glass, multi-touch' },
      { label: 'Battery', value: 'Up to 6 weeks' },
      { label: 'Connectivity', value: 'Bluetooth 5.3 · USB-C' },
    ],
  },
  {
    id: 'flux-charger',
    slug: 'flux-charger',
    name: 'Flux Charger',
    tagline: 'Three devices. One brick.',
    description:
      'A 140W GaN charger small enough to forget in a bag, with three independently negotiated USB-C ports.',
    categoryId: 'accessories',
    variants: [{ id: 'white-charger', name: 'White', price: 12900, swatch: '#f2f2f4' }],
    specs: [
      { label: 'Output', value: '140W total, 3× USB-C' },
      { label: 'Technology', value: 'GaN III' },
      { label: 'Standards', value: 'USB PD 3.1' },
    ],
  },
  {
    id: 'flux-powerbank',
    slug: 'flux-powerbank',
    name: 'Flux Power Bank',
    tagline: 'A full laptop charge, in a coat pocket.',
    description:
      '99.8Wh of capacity — the largest cell you can legally carry on a plane — with 100W passthrough.',
    categoryId: 'accessories',
    variants: [
      { id: 'graphite-bank', name: 'Graphite', price: 14900, swatch: '#3a3a3e' },
    ],
    specs: [
      { label: 'Capacity', value: '99.8 Wh' },
      { label: 'Output', value: '100W USB-C' },
      { label: 'Display', value: 'OLED charge readout' },
    ],
  },
] as const
