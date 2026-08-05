# ROOSA page topology

## Research basis

- Current ROOSA site: product imagery, existing wordmark, migrated editorial titles and public partner marks.
- GiveWell reference: oversized editorial typography, alternating report sections and restrained impact storytelling.
- Soma reference: tall product imagery, generous whitespace and journal-to-commerce relationships.
- Bovist reference: inventory, variants, cart and checkout state architecture.
- Coca-Cola 3D and Sitasys: one hero-scale product motion sequence, clipped transitions and restrained kinetic type.

No reference-template code or media is copied.

## Global structure

1. Announcement bar — normal flow, fixed height, optional impact link.
2. Sticky header — transparent at page top, solid after 24px scroll.
3. Main content — all essential copy and commerce controls are server-rendered HTML.
4. Cart drawer — fixed dialog overlay, client state, focus managed.
5. Footer — six-column desktop / stacked mobile.
6. Sticky mobile purchase bar — product routes only.

## Homepage

1. Hero / paper-roll story — scroll-enhanced, static fallback always present.
2. Product-proof strip — static with document placeholders.
3. Main product module — quantity and add-to-cart interaction.
4. Brand statement — viewport-triggered paper mask.
5. Impact mechanism — three factual steps connected by the paper trail.
6. Product options — product cards, alternate image hover on capable pointers.
7. Impact metrics — CMS-shaped placeholders with reporting period and source.
8. Featured project — calm editorial panel; no playful motion over sensitive imagery.
9. Origin story — concise, placeholder portrait treatment.
10. Trust strip — approval-gated logos and proof links.
11. Final purchase CTA — subtle paper loop.

## Route system

- `/` redirects to `/en`.
- `/[locale]` supports `en`, `de`, and `fr`.
- Localized route families: shop, product, impact, impact projects, about, b2b, journal, support, contact, careers, privacy, imprint, shipping and returns.
- Shopify remains the eventual source of price, inventory, variants and checkout URLs.
