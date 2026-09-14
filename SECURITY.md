# Security Policy

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability and do not include
credentials, customer data, order data, or sensitive production details in a
report. If private GitHub security advisories are enabled for this repository,
use the repository's **Security** tab to submit a private advisory. Otherwise,
contact the repository owner through the established private channel.

Please include:

- a clear description of the issue and its potential impact;
- the smallest safe reproduction steps or proof of concept;
- affected route, component, version, or commit when known; and
- suggested mitigation, if you have one.

Do not test against production systems, real customer accounts, or live third
party services without written authorization. Avoid service-disrupting tests.

## Scope and handling

The default branch is the supported code line. Reports are assessed privately,
prioritized by impact and reproducibility, and handled in coordination with the
reporter when contact information is available. Please allow the maintainers
time to investigate and remediate before discussing a report elsewhere.

If a secret is accidentally committed, revoke or rotate it immediately in its
source system, then report the exposure privately. Removing a value from Git
history alone is not a sufficient remediation.

## Preventive controls

- Keep dependencies and GitHub Actions under review.
- Use least-privilege repository and deployment permissions.
- Store secrets only in approved encrypted secret stores.
- Require CI and human review before merging into the default branch.
