# Website hosting

The public review website is hosted on **GitHub Pages**:

**https://saeedkhoury.github.io/sky-phone-apple-selection/en/**

The repository at `github.com/saeedkhoury/sky-phone-apple-selection` contains
source and documentation. It is a different address from the website. The
repository's About website field and the first README link point to the site.

## Publishing updates

1. Commit and push the reviewed changes to `main`.
2. Open **Actions → Publish storefront** in GitHub.
3. The workflow installs dependencies, lints, runs unit tests, builds the
   static site, and tests the exported customer journeys.
4. A successful deployment publishes `out/` to GitHub Pages. Refresh the
   website to review it; the URL stays the same.

The Pages setting uses **GitHub Actions**, not **Deploy from a branch**.
Publishing the raw repository through the latter setting previously displayed
the README because it did not run the Next.js build.

## Local verification

```bash
npm run build:pages
npm run test:pages
```

The export test server mounts `out/` beneath `/sky-phone-apple-selection/`, just
like GitHub Pages, and checks real images, videos, styles, direct routes,
brand filters, search, language switching, and bag persistence. For manual review:

```bash
node scripts/serve-pages.mjs
```

Open `http://127.0.0.1:4173/sky-phone-apple-selection/en/`.

To verify the deployed site with the same browser checks:

```bash
PAGES_TEST_URL=https://saeedkhoury.github.io/sky-phone-apple-selection npm run test:pages
```

## Hosting behavior

- `npm run dev` and `npm run build` keep the regular Next.js server deployment.
- `npm run build:pages` enables static export and trailing slashes. Pages cannot
  run the Next.js language proxy; the generated root entry chooses a supported
  browser language and provides language links without JavaScript.
- All localized pages are exported. Search and brand filters read query
  parameters in the browser; the catalog stays in the existing typed source.
- `NEXT_PUBLIC_BASE_PATH` prefixes public images/video and framework routes for
  repository hosting. The workflow gets this value from GitHub Pages metadata.
- Metadata uses the published origin. The public review export requests
  `noindex,nofollow`; this is a search-engine instruction, not access control.
- GitHub Pages does not support this project's Next.js custom response headers.
  The regular server build retains them. Review the hosting/header requirements
  when moving to the approved commercial domain.

## Store-owner approval and next step

This is the publicly shareable review version requested by the project owner.
It does not represent recorded store-owner approval of prices, stock, policies,
or the business launch. Use the [launch checklist](owner-approval-and-launch.md)
for that milestone. No payment backend has been introduced.

For the approved store, deploy the regular Next.js build to a Node-capable host,
set `NEXT_PUBLIC_SITE_URL` to the confirmed domain, leave
`NEXT_PUBLIC_BASE_PATH` unset for a root-domain deployment, and verify the live
customer journeys before handing over the domain. Update this guide and the
README's website links at that point.

For a bad release, revert the relevant source commit with a new reviewed
commit and push to `main`; the workflow republishes the corrected build.
