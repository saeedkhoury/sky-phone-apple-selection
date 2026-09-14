# Quality Assurance Guide

This document is the current verification reference for **Sky Phone — Apple
Selection**. It replaces the pre-rebrand Axiom Store report, which described a
different product and is not release evidence for this project.

## Automated coverage

| Layer | Tool | What it protects |
| --- | --- | --- |
| Code quality | ESLint | TypeScript/React and framework-quality issues. |
| Business logic | Vitest | Currency formatting, catalogue queries, cart state, support responses, reduced motion, and theme state. |
| Coverage | Vitest + V8 | An 80% threshold for the reusable logic in `src/lib`. |
| Customer journeys | Playwright + Chromium | Language/RTL rendering, catalogue, filters, hero artwork and continuous looping, seven-second autoplay, bag/WhatsApp handoff, repairs, navigation, chat accessibility, and theme behavior. |
| Mobile input | Playwright + Chromium/WebKit | Touch-based navigation, product selection and bag, hero controls/CTA, search, chat, WhatsApp handoff, compact screens, and splash-layer hit testing in all three languages. |
| Production safety | Next.js build | Route generation, type checking, and production compilation. |

## Release verification

Run the following from a clean checkout before a customer-facing release:

```bash
npm ci
npm run lint
npm test
npm run build
npx playwright install --with-deps chromium webkit
npm run test:e2e
```

The GitHub workflow runs the same baseline checks on pushes and pull requests.
The Pages deployment additionally runs `npm run build:pages` and
`npm run test:pages` against the static export before publishing. See the
[hosting guide](../hosting.md) for the public-URL verification command.
The shared hero regression suite exercises repeated forward/backward loops in
all three languages, mobile dragging, seven-second holds, continued playback
after manual navigation, and the explicit pause/resume control. Reduced-motion
mode keeps the seven-second cadence but changes slides without sliding animation.
The catalog-ordering suite checks category/brand grouping, newer models first,
homepage highlights, category art, navigation menus, and desktop/mobile search
suggestions. These checks run against development, the static export, and the
public URL. See [Product display order](../catalog-ordering.md) for the data policy.
The mobile-interactions suite runs in Chromium and iPhone-emulated WebKit in
both development CI and the Pages deployment gate. WhatsApp navigation is
intercepted in tests: no real message is sent. Native Chromium touch gestures
also verify hero swipes and looping in English, Hebrew, and Arabic.
For deployments, also complete the manual smoke tests in
[Owner Approval & Launch Checklist](../owner-approval-and-launch.md).

## Visual review standard

Automated image-decoding and layout tests catch common regressions, but visual
approval still needs a human. Review the home carousel, category grid, product
gallery, bag, navigation, and footer at desktop and phone widths in Hebrew,
Arabic, and English. Confirm especially that tall product art is fully visible
within its container, not cropped or split.

Capture route, locale, viewport, browser, expected result, actual result, and
a screenshot/recording for every reported defect. Add a focused regression test
when a testable defect is fixed.

For a repeatable visual-review set, run:

```bash
SHOT_DIR=artifacts/visual npx playwright test e2e/visual-capture.spec.ts
```

The generated images are intentionally ignored; attach the relevant evidence to
the pull request or release record instead of committing it as source.

## Current limits

- Mobile WebKit is an automated iPhone emulation, not a physical-device test.
  Keep real iPhone/Android checks in the owner review; Firefox is not yet in CI.
- There is no baseline screenshot-diff service yet. Use structured manual
  visual review for campaign and layout changes until one is approved.
- Tests do not prove commercial accuracy: the owner must approve prices,
  availability, asset permissions, translations, business policies, and staff
  response readiness.

## Mobile interaction fix — 14 September 2026

- **Reproduced on the published site:** iPhone-emulated WebKit finished the
  splash animation with `opacity: 0` but retained `visibility: visible`.
  Hit testing still selected the full-screen splash; taps on navigation,
  products, and the chatbot were intercepted. Chromium did not reproduce it.
- **Fix:** the decorative splash always has `pointer-events: none`. Its base
  state is hidden; a backwards-filled entrance/fade temporarily reveals it
  and then releases the animation. Disabled/reduced-motion animations leave
  the content available without relying on JavaScript cleanup.
- **Mobile affordances:** carousel dots and compact navigation have 44px
  targets, the search field can shrink without hiding its close control, and
  contact buttons account for the bottom safe area. The chatbot uses a speech
  bubble; the separate green WhatsApp link uses the existing shop number.
- **Local Safari:** HTTPS asset upgrades are disabled only in development
  (production CSP is unchanged). The developer badge is hidden so it cannot
  overlap floating contact actions in localhost previews.
- **Release gate:** mobile regressions now run before every Pages deployment.
- **Local verification:** lint, 139 unit tests, production build, 103 browser
  tests (three optional visual-capture tests skipped), and 44 static-export
  tests passed. Mobile Safari screenshots were inspected in Hebrew with the
  chat closed and open.
