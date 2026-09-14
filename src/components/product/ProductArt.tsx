import type { CSSProperties } from 'react'

/**
 * Generated device artwork. Apple's pages lean on product photography; we have
 * no rights to any, so each category gets a drawn silhouette built from the
 * selected variant's swatch — gradients, a specular highlight and a contact
 * shadow, so tiles read as hardware rather than coloured rectangles.
 */

interface ProductArtProps {
  categoryId: string
  /** Hex colour of the selected variant. */
  swatch: string
  className?: string
  style?: CSSProperties
}

function Defs({ id, swatch }: { id: string; swatch: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0%" stopColor={swatch} stopOpacity="1" />
        <stop offset="55%" stopColor={swatch} stopOpacity="0.82" />
        <stop offset="100%" stopColor={swatch} stopOpacity="0.55" />
      </linearGradient>

      <linearGradient id={`${id}-screen`} x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#0b0b0f" />
        <stop offset="60%" stopColor="#15161b" />
        <stop offset="100%" stopColor="#0b0b0f" />
      </linearGradient>

      <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.28" />
        <stop offset="45%" stopColor="#fff" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </linearGradient>

      <radialGradient id={`${id}-glow`} cx="0.5" cy="0.42" r="0.62">
        <stop offset="0%" stopColor={swatch} stopOpacity="0.2" />
        <stop offset="55%" stopColor={swatch} stopOpacity="0.08" />
        <stop offset="100%" stopColor={swatch} stopOpacity="0" />
      </radialGradient>

      <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dy="14" stdDeviation="16" floodColor="#000" floodOpacity="0.55" />
      </filter>
    </defs>
  )
}

export function ProductArt({ categoryId, swatch, className, style }: ProductArtProps) {
  // Unique per swatch so multiple tiles on a page never share gradient ids.
  const id = `art-${categoryId}-${swatch.replace('#', '')}`

  // Purely decorative: every usage sits beside the product name in text, so the
  // artwork is hidden from assistive tech rather than labelled. Deliberately no
  // role="img" here - that would contradict aria-hidden.
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <Defs id={id} swatch={swatch} />
      {/* The glow is an ellipse, not a full-bleed rect: a rect renders a
          visible rectangular edge against the container's own gradient. */}
      <ellipse cx="200" cy="150" rx="200" ry="150" fill={`url(#${id}-glow)`} />
      <g filter={`url(#${id}-shadow)`}>{shapeFor(categoryId, id, swatch)}</g>
    </svg>
  )
}

function shapeFor(categoryId: string, id: string, swatch: string) {
  switch (categoryId) {
    case 'laptops':
      return <Laptop id={id} />
    case 'phones':
      return <Phone id={id} />
    case 'audio':
      return <Audio id={id} swatch={swatch} />
    case 'displays':
      return <Display id={id} />
    default:
      return <Accessory id={id} />
  }
}

/** Open clamshell seen slightly from the front. */
function Laptop({ id }: { id: string }) {
  return (
    <>
      <rect x="92" y="58" width="216" height="142" rx="10" fill={`url(#${id}-body)`} />
      <rect x="100" y="66" width="200" height="126" rx="5" fill={`url(#${id}-screen)`} />
      <rect x="100" y="66" width="200" height="126" rx="5" fill={`url(#${id}-sheen)`} />
      <circle cx="200" cy="72" r="1.6" fill="#2a2c33" />
      {/* Base: a shallow trapezoid reads as perspective. */}
      <path d="M74 200h252l16 18H58z" fill={`url(#${id}-body)`} />
      <rect x="176" y="203" width="48" height="3" rx="1.5" fill="#000" opacity="0.35" />
    </>
  )
}

/** Phone, front-on, with a pill cutout and camera plateau hint. */
function Phone({ id }: { id: string }) {
  return (
    <>
      <rect x="152" y="30" width="96" height="200" rx="22" fill={`url(#${id}-body)`} />
      <rect x="158" y="36" width="84" height="188" rx="18" fill={`url(#${id}-screen)`} />
      <rect x="158" y="36" width="84" height="188" rx="18" fill={`url(#${id}-sheen)`} />
      <rect x="186" y="44" width="28" height="7" rx="3.5" fill="#000" opacity="0.8" />
      {/* Side button */}
      <rect x="248" y="86" width="2.5" height="24" rx="1.25" fill="#000" opacity="0.35" />
    </>
  )
}

/** Charging case with a bud resting above it. */
function Audio({ id, swatch }: { id: string; swatch: string }) {
  return (
    <>
      <rect x="132" y="112" width="136" height="104" rx="26" fill={`url(#${id}-body)`} />
      <rect x="132" y="112" width="136" height="104" rx="26" fill={`url(#${id}-sheen)`} />
      <rect x="152" y="150" width="96" height="2.5" rx="1.25" fill="#000" opacity="0.28" />
      <circle cx="200" cy="196" r="4" fill="#000" opacity="0.25" />
      {/* Single bud above the case */}
      <g>
        <circle cx="200" cy="76" r="21" fill={swatch} />
        <circle cx="200" cy="76" r="21" fill={`url(#${id}-sheen)`} />
        <rect x="194" y="90" width="12" height="30" rx="6" fill={swatch} />
        <circle cx="200" cy="70" r="6" fill="#000" opacity="0.22" />
      </g>
    </>
  )
}

/** Display on a stem-and-foot stand. */
function Display({ id }: { id: string }) {
  return (
    <>
      <rect x="60" y="42" width="280" height="172" rx="12" fill={`url(#${id}-body)`} />
      <rect x="70" y="52" width="260" height="152" rx="6" fill={`url(#${id}-screen)`} />
      <rect x="70" y="52" width="260" height="152" rx="6" fill={`url(#${id}-sheen)`} />
      <rect x="186" y="214" width="28" height="40" fill={`url(#${id}-body)`} />
      <rect x="140" y="252" width="120" height="9" rx="4.5" fill={`url(#${id}-body)`} />
    </>
  )
}

/** Low-profile keyboard-style slab with key rows. */
function Accessory({ id }: { id: string }) {
  const keys = Array.from({ length: 11 }, (_, i) => i)
  return (
    <>
      <rect x="66" y="106" width="268" height="92" rx="12" fill={`url(#${id}-body)`} />
      <rect x="66" y="106" width="268" height="92" rx="12" fill={`url(#${id}-sheen)`} />
      {[0, 1, 2].map((row) => (
        <g key={row}>
          {keys.map((key) => (
            <rect
              key={key}
              x={80 + key * 22.5}
              y={118 + row * 22}
              width="17"
              height="16"
              rx="3.5"
              fill="#000"
              opacity="0.22"
            />
          ))}
        </g>
      ))}
      <rect x="124" y="184" width="152" height="8" rx="4" fill="#000" opacity="0.22" />
    </>
  )
}
