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
| Production safety | Next.js build | Route generation, type checking, and production compilation. |

## Release verification

Run the following from a clean checkout before a customer-facing release:

```bash
npm ci
npm run lint
npm test
npm run build
npx playwright install --with-deps chromium
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

- Browser automation currently uses Chromium only; add Firefox and WebKit to
  the release matrix when hosting and launch scope are approved.
- There is no baseline screenshot-diff service yet. Use structured manual
  visual review for campaign and layout changes until one is approved.
- Tests do not prove commercial accuracy: the owner must approve prices,
  availability, asset permissions, translations, business policies, and staff
  response readiness.
