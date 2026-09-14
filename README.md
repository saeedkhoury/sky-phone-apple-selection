# Axiom Store

An online store for tech and gadgets, built to mirror the design language of
`developer.apple.com` — the same chrome, type scale, spacing rhythm, motion and
colour system.

## Design provenance

The design tokens in [`src/styles/tokens.css`](src/styles/tokens.css) were
transcribed from Apple's live production stylesheets (`globalnav.css`,
`dark-mode.css`, `footer.dist.css`, `home-alt.css`) rather than estimated by
eye — nav height 48/44px, `rgba(22,22,23,0.8)` with `saturate(180%) blur(20px)`,
fill blue `#0071E3`, surfaces `#000`/`#161617`/`#1d1d1f`, 17px nav type,
`-0.022em` display tracking, `cubic-bezier(0.4, 0, 0.6, 1)` easing, and Apple's
1068 / 833 / 767 / 734px breakpoints.

**No Apple intellectual property is reproduced here** — no logos, wordmarks,
product photography, or marketing copy. Product imagery is generated SVG
([`ProductArt.tsx`](src/components/product/ProductArt.tsx)). The brand, catalog
and copy are placeholders ("Axiom") for you to replace.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm test` | Unit + integration tests (Vitest) |
| `npm run test:coverage` | Coverage, gated at 80% on `src/lib` |
| `npm run test:e2e` | End-to-end journeys (Playwright) |
| `npm run lint` | ESLint |

First E2E run needs `npx playwright install chromium`.

## Architecture

```
src/
  app/                 routes: home, store/[category], product/[slug],
                       search, cart, checkout, support
  components/
    nav/               sticky blurred nav, mega-menu flyouts, search takeover,
                       mobile hamburger
    footer/            multi-column footer, mobile accordions, theme toggle
    hero/              auto-rotating hero carousel
    tiles/             product tiles and the responsive grid
    product/           detail view, variant picker, generated artwork
    ui/                Button, SectionHeader
  lib/
    cart/              pure immutable reducer + selectors + provider
    catalog/           typed catalog data, search/filter/sort
    checkout/          shipping-form validation
    format/            currency (integer cents)
    theme/             external theme store (useSyncExternalStore)
  styles/tokens.css    the design tokens
e2e/                   Playwright journeys
docs/testing/          TDD evidence report
```

### Conventions worth knowing

- **Money is always integer cents.** It is converted to a decimal string only at
  display time, so rounding never accumulates across cart lines.
- **The cart reducer is pure and never mutates.** Lines are keyed by product
  *and* variant, so two configurations of one product stay separate.
- **Persisted cart state is untrusted.** `localStorage` is user-writable, so
  `HYDRATE` validates every line and drops anything malformed.
- **Theme lives outside React** in a module-level store read through
  `useSyncExternalStore`, with a blocking inline script applying it before first
  paint so there is no flash of the wrong palette.

## Status and limits

- Checkout **takes no payment**. It validates delivery details and records the
  order locally. Wire up a payment provider before taking real orders.
- There is no backend, no accounts and no order history. The catalog is local
  typed data in [`src/lib/catalog/products.ts`](src/lib/catalog/products.ts).
- E2E runs on Chromium only.

## Making it yours

1. Replace the catalog in `src/lib/catalog/products.ts`.
2. Find and replace the "Axiom" brand name (nav, footer, metadata, README).
3. Swap generated artwork for real photography by replacing `ProductArt` usage
   in `ProductTile`, `HeroCarousel`, `ProductDetail` and `SearchOverlay`.
4. Adjust `TAX_RATE` in `src/lib/format/currency.ts` for your jurisdiction.
5. Remove the demonstration disclaimer in `GlobalFooter.tsx` and the
   payment notice in `src/app/checkout/page.tsx`.
