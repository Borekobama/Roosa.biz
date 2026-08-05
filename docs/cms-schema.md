# CMS schema

The implementation models the following collections from the supplied plan:

- Products: Shopify identifiers, storytelling, specifications, gallery, certification references, related content and locale.
- Impact Projects: partner, location, period, contribution, objective, activities, results, status, documents and approved media.
- Partners: identity, role, verification details, website and related projects.
- Impact Periods: dates, contribution totals, project/partner counts, methodology and report file.
- Certifications: issuer, certificate number, validity, document and verification URL.
- Retailers: region, purchase URL, address and availability.
- Journal, FAQs and Team.

Types live in `src/types/content.ts`; placeholder fixtures live in `src/lib/content.ts`. Optional values must collapse cleanly rather than leave empty cards.
