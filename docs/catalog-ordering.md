# Product display order

All product lists use one canonical catalog order:

1. Phones → tablets → computers/laptops → gaming → accessories.
2. Within a category, keep brands together in the same order as the brand filters.
3. Within each category and brand, show newer generations first. Within a
   generation, place Pro Max/Ultra before Pro and standard models.

`src/lib/catalog/ordering.ts` applies this policy. Each product's required
`displayOrder` in `src/lib/catalog/products.ts` is its reviewed position within
its category and brand; smaller numbers appear first. The canonical `products`
export is sorted, so homepage highlights, category/brand pages, navigation
menus, search suggestions, and support-chat cards cannot drift apart.
Category thumbnail art follows the first product in that category too.

Badges, prices, record IDs, and insertion order do not determine freshness.
Do not infer generation from arbitrary digits: a laptop screen size, charger
wattage, or a number from another product family is not a release generation.
For example, AirPods 4 is newer than AirPods Pro 2, despite the different tiers.
See Apple's [AirPods 4 announcement](https://www.apple.com/newsroom/2024/09/apple-introduces-airpods-4-and-a-hearing-health-experience-with-airpods-pro-2/).

Search still puts an exact requested model ahead of partial matches. Within
each relevance group it uses the same catalog order. Explicit price/name sorts
remain available to code callers. Shopping-bag lines retain the customer's
addition order; campaign hero slides retain their separately curated sequence.

## Adding or correcting a product

- Confirm the exact SKU/generation and owner-approved stock, imagery, and price.
- Assign a unique positive `displayOrder` within its category and brand. Leave
  gaps between positions to allow later insertions, or renumber the group.
- Add/update ordering expectations and run unit, browser, and static-export tests.
- Do not create inventory merely because a manufacturer releases a new model.

The current Apple phone inventory is 17 Pro Max → 17 Pro → 17 → 15 Pro → 14.
No iPhone 16 entries currently exist. Positions between the 17 and 15 families
are available when the owner supplies those SKUs and their commercial details.

Generic entries such as `iPad`, `Dell XPS 13`, and the mixed-variant `Steam Deck`
do not identify an unambiguous release year. Their display positions are
merchandising fallbacks, not release-date claims; confirm exact generations
before replacing them or adding comparable models. No prices, availability,
or product specifications were changed as part of this ordering update.
