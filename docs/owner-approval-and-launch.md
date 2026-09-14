# Owner Approval & Launch Checklist

This document is the business sign-off record for **Sky Phone — Apple Selection**.
It separates what is already implemented from the decisions that only the store
owner can approve. Do not describe the site as live until every required item
below has an owner, evidence, and a decision.

## Current implementation boundary

The site is a trilingual (Hebrew, Arabic, English) Next.js storefront with RTL
support, product browsing, search, a browser-local bag, repair enquiries, and
WhatsApp order/support handoff.

It is **not** an ecommerce order-management system yet:

- Prices and catalog data are maintained in source code; they are not connected
  to POS, stock, CRM, payment, or delivery systems.
- The bag is stored only in the visitor's browser. Selecting "order" prepares a
  WhatsApp message; a staff member must confirm availability, final price,
  payment, and fulfillment.
- No card payment, automatic order confirmation, customer account, or inventory
  reservation is currently implemented.

## Required owner approvals

| Gate | Owner must confirm | Evidence to retain | Status |
| --- | --- | --- | --- |
| Business identity | Store name, phone/WhatsApp number, address, map pin, social profiles, and operating hours | Written confirmation or approved source record | ☐ |
| Catalog | Every product name, model, variant, price in ILS, availability wording, and repair service | Dated catalog approval | ☐ |
| Customer promises | WhatsApp response target, payment options, collection/delivery terms, returns/warranty policy, and repair quote process | Approved customer-policy copy | ☐ |
| Languages | Hebrew, Arabic, and English business copy is accurate and culturally appropriate | Native-speaker/owner review | ☐ |
| Images and video | Sky Phone has permission to use every supplied, manufacturer, or third-party asset | Asset register with source, rights, and expiry/review date | ☐ |
| Legal and privacy | Required local terms, privacy notice, cookies/analytics notice, accessibility statement, and business disclosures | Owner/legal approval appropriate to the business | ☐ |
| Domain and email | Production domain, DNS owner, registrar access, operational mailbox, and recovery contacts | Access inventory and DNS verification | ☐ |
| Launch support | Named people can receive WhatsApp enquiries and update stock/prices | Rota, response target, and escalation contact | ☐ |

### Asset-rights decision

Do not assume that an image found online is cleared for retailer use. Keep an
asset register outside the code repository with: filename, product/campaign,
source URL or owner, licence/permission, attribution requirement, approver, and
replacement deadline. The existing catalog includes a mix of manufacturer,
Wikimedia, supplied, and synthetic/mockup imagery. In particular, replace or
explicitly approve the low-resolution synthetic iPhone 17 Pro and iPhone 17 Pro
Max imagery before a public commercial launch.

## Production configuration

Before the first deployment, set the public canonical URL in the hosting
environment:

```text
NEXT_PUBLIC_SITE_URL=https://www.your-confirmed-domain.example
```

Then verify that the deployed domain redirects consistently (choose either the
`www` or apex domain), serves HTTPS, and generates absolute Open Graph URLs for
the chosen domain. Do not commit production credentials, domain-provider
secrets, or hosting tokens to this repository.

The current security headers are suitable as a documented starting point, but
the Content Security Policy permits inline scripts because of the static Next.js
rendering strategy. The release owner should record that acceptance and revisit
a nonce-based CSP if the project later moves to dynamic/server-rendered pages.

## Release gate

The release manager records the exact commit and deployment URL, then completes
these checks against the production-like build:

```bash
npm ci
npm run lint
npm test
npm run build
npm run test:e2e
```

Manual smoke checks are still required:

- Browse home, category, product, search, repair, About, and bag flows in all
  three languages; check Hebrew and Arabic RTL layouts on a phone and desktop.
- Confirm product and hero images, reel posters/videos, links, telephone,
  map, WhatsApp message text, prices, and operating hours.
- Test the actual deployed domain in a private browser window and on a mobile
  network. Verify metadata/social preview after DNS has propagated.
- Have the owner complete one real enquiry end-to-end, including staff response
  and stock/price confirmation.

## Go / no-go record

| Decision | Name | Date | Commit / deployment URL | Notes |
| --- | --- | --- | --- | --- |
| Content and customer promises approved |  |  |  |  |
| Asset rights confirmed |  |  |  |  |
| Legal/business approval complete |  |  |  |  |
| Technical release approved |  |  |  |  |
| Go live / no-go decision |  |  |  |  |

## After launch

For the first week, review new enquiries daily for incorrect prices, broken
links, untranslated copy, asset problems, and response delays. Keep the prior
deployment available. If a release causes customer-facing harm, restore the
last known-good deployment first, then diagnose and release a tested fix; do
not edit production files manually as a substitute for a tracked release.
