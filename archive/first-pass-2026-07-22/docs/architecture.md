# Architecture

## Runtime

- Next.js App Router and TypeScript.
- Server-rendered content and route metadata.
- Client components only for navigation state, cart state, forms and progressive motion.
- Locale-prefixed routes for English, German and French; `/` redirects to `/en`.

## Responsibility boundaries

- Next.js currently provides the local marketing/CMS presentation layer and can be exported or translated into Webflow components.
- Shopify is the planned source of product title, price, inventory, variants, discounts, orders, checkout, taxes and shipping.
- The local product adapter contains explicit placeholders and never presents them as live data.
- Impact/editorial structures mirror the proposed CMS collections and can later be fed by Webflow CMS or another verified source.

## Progressive enhancement

The headline, product imagery, purchase controls and impact explanation render as HTML. Motion enhances these layers without owning content. The CSS roll is the working technical prototype/fallback; a licensed GLB/Spline scene can replace the decorative stage without changing page semantics.

## Security

Only a public Storefront token may be exposed to the browser. Shopify Admin credentials, private app secrets and customer personal data must never enter client bundles or this repository.
