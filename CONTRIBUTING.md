# Contributing

This is a private commercial web project. Contributions are limited to invited
or explicitly approved collaborators. Treat all business, customer, order, and
operational information as confidential.

## Local setup

Use Node.js 22 and the committed npm lockfile.

```bash
npm ci
npm run dev
```

Before requesting review, run the checks relevant to your change:

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

Playwright may need its local Chromium binary installed once:

```bash
npx playwright install chromium
```

## Delivery workflow

1. Start from an agreed issue, approved request, or documented maintenance
   task. Use the issue forms for defects and proposals; do not use them for
   security reports.
2. Create a focused branch using a clear prefix such as `feature/`, `fix/`, or
   `chore/`. Keep commits small and descriptive.
3. Make the change with the affected languages, responsive layouts, and
   accessibility behavior in mind. Add or update automated tests whenever
   behavior changes.
4. Open a pull request using the template. Include test evidence and visual
   evidence when the interface changes.
5. Do not merge until required checks pass and an authorized reviewer has
   approved the change.

## Commercial launch guardrails

The current application must not be treated as authorization to activate a
live commerce operation. Changes to prices, stock, checkout or payment flows,
fulfilment, returns, privacy or legal copy, business contact details, and
production integrations require explicit approval from the business owner and
an appropriate pre-launch review.

Use non-production data and test accounts while developing. Never commit
credentials, API keys, customer details, order details, private contracts, or
unlicensed media. Keep environment values in local secret management or the
deployment platform's encrypted secret store.

## Review standard

A ready change is scoped, readable, tested, and reversible where practical.
It should preserve the project’s supported locales, keyboard behavior, and
mobile layout. Record known limitations, rollout steps, and follow-up work in
the pull request rather than leaving them implicit.
