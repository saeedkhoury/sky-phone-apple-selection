# Operating Workflow

This is the working agreement for taking Sky Phone — Apple Selection from the
current storefront into an operating business project. It is intentionally
lightweight: every customer-visible change has an owner, a review, a testable
release, and a way back.

## Roles and responsibilities

| Role | Accountable for | Typical work |
| --- | --- | --- |
| Store owner | Business truth and launch approval | Prices, stock, policies, opening hours, supplier/product approval, asset rights, and customer promises |
| Catalog/content manager | Accurate customer-facing content | Product data, translations, photos, campaign copy, and asset register |
| Developer / release manager | Technical quality and controlled releases | Code review, automated checks, deployment, security configuration, rollback readiness |
| Sales and support team | Enquiry conversion and customer care | WhatsApp responses, availability/pricing confirmation, repair intake, and issue escalation |

One person may hold more than one role at first, but the owner remains the
final approver of commercial facts and launch decisions.

## Customer handoff workflow

1. A visitor browses the catalog or adds products to the bag.
2. The site creates a WhatsApp enquiry; it does not take payment or reserve
   inventory.
3. A named sales/support person confirms current stock, final price, variant,
   payment method, collection/delivery, and any warranty/repair conditions.
4. Staff records the agreed order or repair in the business system selected by
   the owner (POS, CRM, spreadsheet, or future integrated backend).
5. Escalate pricing conflicts, out-of-stock items, refunds, repair estimates,
   and safety/privacy concerns to the owner before promising a resolution.

Set a realistic response target and cover hours before launch. If WhatsApp is
not monitored, the CTA must not be promoted as an immediate service.

## Catalog and asset change process

Use this process for every new product, price change, campaign, photo, or video:

1. **Request:** Owner/supplier provides approved product facts, price, variants,
   stock wording, and asset rights.
2. **Record:** Catalog manager adds the source and rights record to the private
   asset register. Never place supplier contracts, credentials, or personal data
   in the public repository.
3. **Prepare:** Update the typed catalog in `src/lib/catalog/`, localized copy
   in `src/lib/i18n/messages/`, and local media under `public/img/` or
   `public/video/` as appropriate.
4. **Review:** Owner verifies product facts and translated customer copy;
   developer checks layout, image crop/quality, links, and responsive/RTL
   presentation.
5. **Verify:** Run lint, unit tests, production build, and relevant browser
   journeys. Add a regression test if a defect was fixed.
6. **Release:** Deploy a reviewed commit, verify production, and note the
   release version/date in the change log or ticket.

Do not publish a price based on a verbal estimate. Keep all public prices,
availability statements, and promotion dates owner-approved and dated.

## Engineering and release workflow

```text
Request → acceptance criteria → isolated change → review → automated checks
        → owner/content sign-off → deploy → production smoke test → monitor
```

For each change:

- State what is changing, which locale(s) and routes are affected, and the
  acceptance criteria before implementation.
- Work from an up-to-date branch; keep commits focused and do not mix business
  content, unrelated cleanup, and infrastructure changes without noting them.
- Require a peer or release-manager review for customer-impacting code,
  domain/configuration changes, and permissions/secrets changes.
- Run `npm run lint`, `npm test`, and `npm run build`. Run `npm run test:e2e`
  for navigation, layout, catalog, hero, cart, or customer-flow changes.
- Review desktop and mobile layouts in Hebrew, Arabic, and English whenever
  navigation, text, or CSS changes. RTL layouts use logical CSS properties;
  avoid physical left/right positioning unless explicitly justified.
- Release from a tagged/recorded commit, retain the previous deployment, and
  avoid direct edits on the live host.

## Quality gate

The current project already has ESLint, Vitest, Playwright/Chromium journeys,
a production build, and GitHub continuous integration for pushes and pull
requests. Keep the first production release deliberately small; review
analytics/error monitoring and broader browser testing (Firefox/WebKit) once a
hosting provider and privacy approach are approved.

Every defect report should contain a route, locale, device/browser, expected
result, actual result, screenshot or recording when helpful, and severity. A
fix is complete only after it has been verified and, where practical, protected
by an automated regression test.

## Incident and rollback procedure

Treat these as urgent: incorrect price or contact details, inaccessible
WhatsApp/phone links, broken primary product media, security exposure, legal
complaint, or a major accessibility failure.

1. Pause the affected promotion or customer promise if possible.
2. Capture the deployment URL, time, route, locale, browser, and evidence.
3. Notify the owner for commercial, legal, asset-rights, or customer-impact
   decisions; notify the release manager for technical action.
4. Roll back to the last known-good deployment when that is safer than waiting
   for a fix.
5. Ship a reviewed, tested correction and document the root cause and follow-up
   action.

## Access and support handoff

Maintain a private access register for the domain registrar, DNS, hosting,
GitHub organization/repository, analytics, social accounts, business email,
and WhatsApp Business. Give at least two trusted business owners recovery
access, use multi-factor authentication, and remove access promptly when a
person leaves.

The repository should contain the application source, approved deployable media,
and documentation—not passwords, API keys, customer messages, contracts, or
owner identity documents. Keep a non-public runbook with provider account IDs,
renewal dates, billing owner, and emergency contacts.
