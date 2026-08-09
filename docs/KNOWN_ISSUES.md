# Known issues and external blockers

- No Webflow workspace or Shopify store access was supplied, so this repository is the complete local implementation and integration blueprint rather than a published Webflow/Shopify production site.
- Checkout, inventory, variants, discounts, tax, shipping and subscription behavior require real Shopify configuration.
- The CSS hero roll is a performance-safe mechanics prototype. Final Blender/GLB/Spline source assets require a licensed 3D source or custom model.
- Product, impact, certification and legal facts remain explicit placeholders pending approval.
- Translations require native and legal review.
- Analytics and cookie-consent providers are intentionally not initialized without approved IDs and legal copy.
- The deployed V6 app is on Next.js 16.3.0 and currently passes `npm audit` with no known vulnerabilities. Preserved, non-runtime iterations still retain their original lockfiles and should not be deployed.
