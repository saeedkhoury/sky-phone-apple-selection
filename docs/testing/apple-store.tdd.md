# TDD Evidence Report — Axiom Store

**Plan:** `~/.claude/plans/quizzical-honking-creek.md`
**Branch:** `main`
**Runner:** Vitest 5 (`npm test`), Playwright (`npm run test:e2e`)

---

## 1. Source plan

The plan specified an online store whose design is a 1:1 clone of
`developer.apple.com`, built on Next.js + TypeScript with full browsing and a
cart. Design tokens were transcribed from Apple's live production stylesheets
(`globalnav.css`, `dark-mode.css`, `footer.dist.css`, `home-alt.css`) rather
than estimated by eye — see `src/styles/tokens.css`.

No Apple logos, marks, product photography or copy were reproduced. Product
imagery is generated SVG (`src/components/product/ProductArt.tsx`).

## 2. User journeys

1. As a shopper, I want to browse products by category, so I can narrow to what I need.
2. As a shopper, I want to search by name, so I can find a product without browsing.
3. As a shopper, I want to choose a configuration and add it to my bag, so I can buy the exact variant I want.
4. As a shopper, I want my bag to survive a reload, so I do not lose my selection.
5. As a shopper, I want to change quantities and remove lines, so I can correct my bag.
6. As a shopper, I want clear validation at checkout, so I know exactly what to fix.
7. As a shopper, I want to pick a light or dark theme and have it remembered.
8. As a shopper on a phone, I want to reach every category from the nav.

## 3. Task report

### Task 1 — Currency and tax (`src/lib/format/currency.ts`)

- **Summary:** Money handled as integer cents throughout; formatting only at display time.
- **Command:** `npm test`
- **RED:** `Failed to resolve import "./currency" from "src/lib/format/currency.test.ts"` — compile-time RED, module did not exist.
- **GREEN:** 13 cases pass.
- **Guarantees:** correct formatting of whole dollars, cents and zero; rejection of negative, non-integer and non-finite input; tax always a whole number of cents.

### Task 2 — Cart reducer and selectors (`src/lib/cart/reducer.ts`, `selectors.ts`)

- **Summary:** Pure, immutable reducer. Lines keyed by product **and** variant; per-line quantity capped at 10; `HYDRATE` validates untrusted localStorage.
- **Command:** `npm test`
- **RED:** `Failed to resolve import "./reducer"` — compile-time RED.
- **GREEN:** 31 cases pass.
- **Guarantees:** repeat adds increment rather than duplicate; different variants stay separate lines; quantity clamps at the cap and on repeat adds; zero-quantity removes the line; unknown lines are no-ops; previous state is never mutated; malformed persisted state falls back to an empty cart.

### Task 3 — Catalog query (`src/lib/catalog/query.ts`)

- **Summary:** Weighted substring search (name > tagline > description), category filter, and non-mutating sorts.
- **Command:** `npm test`
- **RED:** `Failed to resolve import "./query"` — compile-time RED.
- **GREEN:** 21 cases pass.
- **Guarantees:** empty and whitespace queries return everything; case-insensitive and partial matching; no-match returns `[]`; name matches rank first; sorts return new arrays; catalog data integrity (unique slugs, known categories, ≥1 variant, positive integer prices).

### Task 4 — Checkout validation (`src/lib/checkout/validate.ts`)

- **Summary:** Validates all five delivery fields at once and bounds field length.
- **Command:** `npx vitest run src/lib/checkout`
- **RED:** `Failed to resolve import "./validate"` — `Test Files 1 failed (1)`, compile-time RED.
- **GREEN:** `Test Files 1 passed (1) · Tests 13 passed (13)`; later extended to 17 to cover every field's length-bound branch.
- **Guarantees:** every invalid field is reported in one pass (not first-error-only); whitespace is trimmed before validating; over-long input is rejected.

### Task 5 — Theme store (`src/lib/theme/themeStore.ts`)

- **Summary:** Theme lives outside React in a module-level external store read via
  `useSyncExternalStore`, with a blocking inline script applying it before first
  paint so there is no flash of the wrong palette.
- **Command:** `npm run test:coverage`
- **Why it was tested after the fact:** this module was extracted during a lint
  fix (replacing `setState`-in-effect), and the first coverage run after the
  extraction dropped the suite to 81.16% by surfacing it untested. Tests were
  then written to cover it rather than excluding it from measurement.
- **GREEN:** 18 cases pass.
- **Guarantees:** only the three valid theme values are accepted; the server
  snapshot is always the dark default; `setTheme` writes storage, sets the
  document attribute and notifies subscribers; unsubscribe stops notification;
  a throwing `localStorage` (private mode, quota) still applies the theme; and
  the shipped inline script applies a stored theme and ignores an invalid one.

## 4. Test specification

| # | What is guaranteed | Test | Type | Result |
|---|--------------------|------|------|--------|
| 1 | Prices render as localized currency from integer cents | `src/lib/format/currency.test.ts` | unit | PASS |
| 2 | Negative, fractional and non-finite amounts are rejected | `src/lib/format/currency.test.ts` | unit | PASS |
| 3 | Tax is always a whole number of cents | `src/lib/format/currency.test.ts` | unit | PASS |
| 4 | Adding the same variant twice increments one line | `src/lib/cart/reducer.test.ts` | unit | PASS |
| 5 | Different variants of one product stay separate lines | `src/lib/cart/reducer.test.ts` | unit | PASS |
| 6 | Quantity is clamped to the per-line maximum | `src/lib/cart/reducer.test.ts` | unit | PASS |
| 7 | The reducer never mutates the state it is given | `src/lib/cart/reducer.test.ts` | unit | PASS |
| 8 | Malformed persisted cart state degrades to an empty cart | `src/lib/cart/reducer.test.ts` | unit | PASS |
| 9 | Empty search returns the full catalog; no-match returns none | `src/lib/catalog/query.test.ts` | unit | PASS |
| 10 | Name matches outrank description-only matches | `src/lib/catalog/query.test.ts` | unit | PASS |
| 11 | Sorting returns a new array rather than sorting in place | `src/lib/catalog/query.test.ts` | unit | PASS |
| 12 | Every catalog product has a unique slug and valid prices | `src/lib/catalog/query.test.ts` | unit | PASS |
| 13 | Checkout reports every invalid field at once | `src/lib/checkout/validate.test.ts` | unit | PASS |
| 14 | A shopper can browse category → product → bag | `e2e/store.spec.ts` | e2e | PASS |
| 15 | The bag survives a page reload | `e2e/store.spec.ts` | e2e | PASS |
| 16 | Changing quantity updates the line total | `e2e/store.spec.ts` | e2e | PASS |
| 17 | The selected variant is the one added to the bag | `e2e/store.spec.ts` | e2e | PASS |
| 18 | Checkout blocks submission and flags all five empty fields | `e2e/store.spec.ts` | e2e | PASS |
| 19 | A valid order completes and empties the bag | `e2e/store.spec.ts` | e2e | PASS |
| 20 | Theme choice persists across a reload | `e2e/store.spec.ts` | e2e | PASS |
| 21 | The nav flyout closes on Escape | `e2e/store.spec.ts` | e2e | PASS |
| 22 | Every category is reachable from the mobile hamburger | `e2e/store.spec.ts` | e2e | PASS |
| 23 | No horizontal overflow at 1440 / 1068 / 833 / 390px | `e2e/store.spec.ts` | e2e | PASS |

## 4b. Review round

Three specialist reviews ran against the finished build. Every CRITICAL and HIGH
finding was fixed, and each fix is locked by a regression test rather than
asserted — the tests below were written to fail against the pre-fix code.

| Finding | Severity | Fix | Regression test |
|---|---|---|---|
| Carousel could not be stopped (WCAG 2.2.2) | CRITICAL | Persistent stop control; stays stopped; dots stop rotation | `the carousel can be stopped and stays stopped`, `choosing a slide by hand stops the rotation` |
| `aria-live` wrapped the whole rotating slide | CRITICAL | Reduced to a text-only "Slide N of M" status | — (structural) |
| Search dialog had no focus trap or focus restore | CRITICAL | Tab cycle implemented; focus returns to the trigger | `the search dialog traps Tab and restores focus on close` |
| Skip link never became visible on focus | CRITICAL | Dedicated `.skip-link` with a `:focus` rule | `the skip link becomes visible when focused and jumps to main` |
| Home `h1` was the rotating product name | HIGH | Stable `h1`; slide heading demoted to `h2` | `the page has exactly one h1 and it does not change on its own` |
| Checkout left focus on submit after failure | HIGH | Focus moves to the first invalid field | `a failed checkout moves focus to the first invalid field`, `focus lands on the first field that is actually invalid` |
| Theme toggle used `aria-pressed` for a single choice | MEDIUM | `radiogroup` with roving tabindex and arrow keys | `the theme control is a radio group operable with arrow keys` |
| Reduced motion did not reach the JS-timer carousel | MEDIUM | `useReducedMotion` hook consulted before rotating | `reduced motion stops the carousel advancing on its own` |
| `role="img"` contradicted `aria-hidden` on artwork | MEDIUM | Dropped `role="img"`, added `focusable="false"` | — (structural) |
| Viewport-sized scrim was focusable | MEDIUM | `tabIndex={-1}` + `aria-hidden` | `the flyout scrim is not a keyboard focus target` |
| **Real hydration mismatch on `<html data-theme>`** | HIGH | `suppressHydrationWarning` on the element the theme script mutates | `hydrating with a stored non-default theme logs no React errors` |
| `ProductDetail` imported the product route's CSS module | HIGH | Colocated as `ProductDetail.module.css` | — (structural; build verifies) |
| No CSP or security headers | MEDIUM | Headers added and verified against a production server | `serves a CSP and the standard hardening headers`, `the CSP does not block the inline theme script` |
| Restored cart lines unbounded in price and count | MEDIUM | `MAX_UNIT_PRICE` and `MAX_CART_LINES` enforced on `HYDRATE` | 4 cases in `reducer.test.ts` |

Two further defects were found by screenshotting the **light** theme, which the
earlier dark-only review had not exercised:

| Defect | Severity | Fix | Regression test |
|---|---|---|---|
| Category tile titles were invisible in light mode — the tiles keep a dark gradient but the text followed `--text-primary`, which goes near-black | HIGH | Text pinned light on those tiles in both themes | `category tile titles stay legible against their dark gradients` |
| The new CSP broke React's dev build, which needs `eval()` | HIGH | `'unsafe-eval'` and websockets allowed in development only | `loads with no console errors in either theme` |

Two findings were investigated and **not** fixed as proposed, with reasons:

- **Hash-based CSP for `script-src`.** The theme script is static and hashes
  correctly, but Next's App Router streams its hydration payload through inline
  `self.__next_f.push(...)` scripts whose content differs per page and cannot be
  hashed at config time. Verified by serving a production build and reading the
  blocked-hash list. The strict alternative is a per-request nonce via
  middleware, which opts every route into dynamic rendering — a real cost for a
  store that is almost entirely statically generated. The shipped CSP therefore
  allows `'unsafe-inline'` for scripts only, keeps every other directive strict,
  and documents the tradeoff in `next.config.ts` for a deliberate decision later.
- **Nav flyout focus movement on open.** Left as-is. The flyout opens on click
  from a trigger that remains focused, Escape closes it, and focus-out dismisses
  it. Moving focus into the panel on open would be the right call if it were a
  menu widget; as a disclosure it is defensible. Noted rather than silently
  dropped.

## 5. Coverage

`npm run test:coverage`, thresholds set at 80% in `vitest.config.mts`:

```
File            | % Stmts | % Branch | % Funcs | % Lines
All files       |   95.75 |    94.25 |   96.55 |    95.8
 cart           |   95.74 |     92.1 |     100 |    97.5
 catalog        |     100 |      100 |     100 |     100
 checkout       |     100 |      100 |     100 |     100
 format         |     100 |      100 |     100 |     100
 hooks          |   88.88 |      100 |      80 |    87.5
 theme          |    82.6 |       50 |    87.5 |   80.95
```

Totals: **111 unit/integration tests, 38 E2E journeys.**

### Known gaps

- Coverage is measured on `src/lib/**` (the logic layer). React components are
  covered behaviourally by the Playwright suite rather than by unit tests —
  deliberate, since assertions on markup are brittle for presentational code.
- E2E runs on Chromium only. Firefox and WebKit projects are not enabled.
- No visual-regression baseline. Layout was verified by screenshot review at
  1440 / 1068 / 833 / 390px and by automated overflow assertions, but there is
  no snapshot diff guarding against future drift.
- Checkout takes no payment, so there is no payment-path coverage by design.
- `themeStore.ts` sits at 50% branch coverage: the `readStored` catch path
  (storage throwing on *read*, as opposed to write) is not exercised.

## 6. Merge evidence

Checkpoint commits on `main`, in order:

| Commit | Stage |
|--------|-------|
| `92c95de` | Scaffold |
| `6e61767` | **RED** — failing specs for currency, cart and catalog |
| `b64e1cb` | **GREEN** — implementations, 65 tests passing, coverage above gate |
| `17fc7ab` | Store UI; checkout validation added RED→GREEN |
| `e9c2658` | Product artwork, mobile nav, 22 E2E journeys |

If these are squashed, this report is the surviving record of what was verified
and how.
