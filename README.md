# Sky Phone

A storefront for Sky Phone — a phone, tablet, computer and gaming shop with
same-day repairs in Kafr Kanna, established 2010.

Trilingual (Hebrew, Arabic, English) with full right-to-left support, built on
the visual language of `developer.apple.com`.

## Getting started

```bash
npm install
npm run dev
```

Opens at http://localhost:3000, which redirects to the visitor's best language —
Hebrew by default.

First E2E run also needs `npx playwright install chromium`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (117 static pages) |
| `npm test` | Unit + integration tests (Vitest) |
| `npm run test:coverage` | Coverage, gated at 80% on `src/lib` |
| `npm run test:e2e` | End-to-end journeys (Playwright) |
| `npm run lint` | ESLint |

## How it is put together

```
src/
  app/[locale]/        every page, statically generated per language:
                       home, store/[category], product/[slug], repairs,
                       about, cart, search
  middleware.ts        sends bare paths to a language
  components/
    nav/               blurred sticky nav, mega-menu, search, language switcher
    footer/            multi-column footer, mobile accordions, theme toggle
    hero/              hero carousel
    tiles/             product tiles and the responsive grid
    product/           detail view, colour and storage pickers, gallery
    repairs/           services strip and line icons
    reels/             the shop's own video clips
    chat/              rule-based support assistant
  lib/
    catalog/           27 SKUs, categories, brands, search and filtering
    cart/              pure immutable reducer + provider
    repairs/           the seven services
    chat/              intent matching
    format/            currency (whole shekels)
    i18n/              locale config + the HE/AR/EN message decks
    theme/             external theme store
public/img, public/video   product photography and shop clips
```

### Decisions worth knowing

- **Money is whole shekels.** The shop prices in round shekels, so there is no
  minor unit to carry. There is deliberately **no tax line**: Israeli consumer
  prices are VAT-inclusive by law, so the shelf price is the price paid.
- **There is no card checkout.** The shop confirms orders over WhatsApp and
  takes payment in store, so the bag composes a real order message rather than
  simulating a payment it cannot process.
- **Repairs carry no prices.** All seven services are listed and each routes to
  a real quote. The owner asked for indicative pricing to be left off; tests
  assert that no shekel sign appears on the repairs page in any language, and
  that the assistant never quotes one. Do not reintroduce prices without asking
  him — an indicative number becomes a promise in the customer's head.
- **Language is a route, not state.** `/he`, `/ar`, `/en` each render on the
  server with the right `lang` and `dir`, so every page is statically
  generated per language and the switcher is a normal navigation.
- **RTL uses logical CSS properties** (`inset-inline-*`, `margin-inline-*`,
  `text-align: start`). A physical `left`/`right` is a layout bug in two of the
  three languages.
- **Theme lives outside React** in a module store read via
  `useSyncExternalStore`, with a blocking inline script so there is no flash of
  the wrong palette.

## Content and rights

- Copy is the shop's own approved trilingual deck (285 keys × 3 languages) in
  `src/lib/i18n/messages/`. Five interface strings (theme switcher labels and a
  social label) were added for this build; everything else is carried over.
- Shop details in `src/lib/shop.ts` were verified against the shop's public
  Instagram. Do not replace them with placeholders.
- **Product imagery is mixed provenance.** Most photos come from Wikimedia
  Commons; some are official manufacturer imagery supplied by the shop owner.
  Using manufacturer photography is normal practice for a retailer selling
  those products, but it is not a licence — if a specific image is ever
  challenged, swap it. Nothing here is presented as Sky Phone's own photography.

## Known gaps

- **Opening hours are unconfirmed.** They were never published publicly and are
  carried over from the previous site as a placeholder. Confirm them with the
  owner before this goes live — they appear on the About page and in the
  assistant.
- **The iPhone 17 Pro / Pro Max images are synthetic mockups with blank
  screens**, not photographs. Replacements were supplied at only 225×225, too
  small for the gallery. These are the next images to replace.
- E2E runs on Chromium only; there is no visual-regression baseline.
- No backend: the catalogue is local typed data and the cart lives in
  `localStorage`. Adding a product means editing
  `src/lib/catalog/products.ts`.
