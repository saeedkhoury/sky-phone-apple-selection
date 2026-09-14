# Sky Phone — Apple Selection

**[Open the Sky Phone website](https://saeedkhoury.github.io/skyphone-ca/)**

Public preview and source for Sky Phone's trilingual storefront. The project
supports Hebrew, Arabic, and English shopping journeys for phones, tablets,
computers, gaming, accessories, repairs, and WhatsApp sales enquiries.

> **Status:** public review preview, pending the store owner's commercial launch
> approval. The bag creates WhatsApp enquiries; there is no payment/inventory backend.

Repository: [saeedkhoury/skyphone-ca](https://github.com/saeedkhoury/skyphone-ca)

The `github.io` link above opens the website. The `github.com` repository link
opens the source code and this README.

## Published website

- [English](https://saeedkhoury.github.io/skyphone-ca/en/)
- [עברית](https://saeedkhoury.github.io/skyphone-ca/he/)
- [العربية](https://saeedkhoury.github.io/skyphone-ca/ar/)

GitHub Pages publishes the built storefront after the **Publish storefront**
workflow succeeds on `main`. Images, videos, search, brand filters, language
navigation, and the browser-local bag are included. See the
[hosting guide](docs/hosting.md) for deployment, checks, and the later domain handoff.

## What is included

- Next.js 16, React 19, TypeScript, and local deployable media assets.
- Localized `/he`, `/ar`, and `/en` routes with correct right-to-left layout.
- Product catalogue, category/brand filters, search, product variants, and a
  browser-local shopping bag.
- WhatsApp and telephone handoff for sales and repair enquiries; no simulated
  payment checkout.
- Accessible navigation, theme handling, carousel controls, security headers,
  Vitest coverage, and Playwright Chromium journeys.
- Continuously looping hero blocks: horizontal scrolling and dragging in both
  directions, automatic seven-second holds, and an explicit pause/resume control.
  Manual navigation keeps autoplay enabled; reduced-motion mode removes the
  sliding animation while preserving the seven-second cadence.

## Start locally

Requires Node.js 22.12 or later and npm 10.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Bare paths redirect to the
visitor's preferred supported language (Hebrew is the fallback).

For the first browser-test run, install Chromium once:

```bash
npx playwright install chromium
```

## Quality commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run unit and integration tests with Vitest. |
| `npm run test:coverage` | Run the coverage gate for `src/lib`. |
| `npm run build` | Produce and validate the production build. |
| `npm run build:pages` | Export the complete website to `out/` for GitHub Pages. |
| `npm run test:pages` | Test the actual static export and repository-prefixed URLs. |
| `npm run start` | Serve a completed production build. |
| `npm run test:e2e` | Run Playwright Chromium customer journeys. |

Run `npm run lint`, `npm test`, and `npm run build` for every change. Run the
browser suite whenever a customer route, layout, catalog, hero, bag, or
navigation flow changes.

## Project map

```text
src/app/[locale]/       Locale-aware pages: home, store, product, repairs,
                         about, search, and bag
src/components/         Reusable navigation, carousel, product, repair, reel,
                         chat, footer, and UI components
src/lib/catalog/        Typed products, categories, filtering, and search
src/lib/i18n/           Hebrew, Arabic, and English message decks / RTL config
src/lib/cart/           Immutable local-shopping-bag state
src/lib/shop.ts         Business contact and WhatsApp-link helpers
src/proxy.ts            Language routing for bare paths
public/img/             Approved-in-progress product and campaign imagery
public/video/           Store reel media and posters
docs/                   Launch gates, operating workflow, and QA evidence
```

## Important commercial boundaries

- **Prices:** catalog prices are whole ILS values and are maintained in source;
  the store owner must approve every current price and availability statement.
- **Orders:** the bag creates a WhatsApp enquiry. Staff must confirm stock,
  final price, payment, collection/delivery, and warranty terms.
- **Repairs:** the site routes to a quote; it intentionally does not publish
  indicative repair prices.
- **Catalog and content:** product data is local typed data. Changes belong in
  `src/lib/catalog/` and the three translation files under `src/lib/i18n/`.
- **RTL:** use CSS logical properties such as `margin-inline` and
  `text-align: start`; hard-coded `left` and `right` create language bugs.

## Production configuration

Copy [`.env.example`](.env.example) to `.env.local` for local deployment
configuration. Before a public launch, set the confirmed canonical domain:

```text
NEXT_PUBLIC_SITE_URL=https://www.your-confirmed-domain.example
```

Do not commit credentials, hosting tokens, domain-provider secrets, customer
data, or supplier agreements. The default `skyphone.example` metadata URL is a
pre-launch fallback only and must not remain on a public deployment.

## Operating the project

- [Operating workflow](docs/operating-workflow.md) defines roles, catalog
  updates, review, QA, release, incident response, and access handoff.
- [Owner approval and launch checklist](docs/owner-approval-and-launch.md)
  records the commercial, asset-rights, legal, domain, and technical gates.
- [Quality assurance guide](docs/testing/quality-assurance.md) describes the
  automated coverage and the release verification record.

The repository and review preview are public at the project owner's request.
Store-owner approval of commercial facts, policies, asset rights, and the final
business launch remains a separate milestone.

## Assets, ownership, and licensing

This repository is commercial source and is intentionally marked
`UNLICENSED`. It contains the runtime images and videos needed for a complete
project checkout and deploy preview. Those assets have mixed provenance (owner-supplied,
manufacturer, Wikimedia, and synthetic/mockup material); repository access is
not proof of a public-use licence. Keep a private asset register and resolve
asset approvals before the store's commercial launch or reuse elsewhere.

## Known pre-launch decisions

- Confirm the real opening hours, product facts, policies, and support rota
  with the owner.
- Replace or explicitly approve the low-resolution synthetic iPhone 17 Pro and
  iPhone 17 Pro Max imagery before public release.
- GitHub Pages hosts the public review preview. Confirm the commercial hosting,
  monitoring, analytics, legal/privacy copy, and custom domain with the owner.
- The Content Security Policy currently permits inline scripts to preserve
  static rendering in the Next.js App Router. Record acceptance at launch and
  reassess a nonce-based CSP if the project becomes dynamic.
