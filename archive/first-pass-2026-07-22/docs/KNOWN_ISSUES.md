# Known issues and external blockers

- No Webflow workspace or Shopify store access was supplied, so this repository is the complete local implementation and integration blueprint rather than a published Webflow/Shopify production site.
- Checkout, inventory, variants, discounts, tax, shipping and subscription behavior require real Shopify configuration.
- The CSS hero roll is a performance-safe mechanics prototype. Final Blender/GLB/Spline source assets require a licensed 3D source or custom model.
- Product, impact, certification and legal facts remain explicit placeholders pending approval.
- Translations require native and legal review.
- Analytics and cookie-consent providers are intentionally not initialized without approved IDs and legal copy.
- The current Next.js 16.2.11 package bundles PostCSS 8.4.31 and Sharp 0.34.5, which npm audit flags through 2026 advisories. npm incorrectly proposes a downgrade to Next 9.3.3 as the only automatic fix; do not apply that breaking downgrade. Recheck when a patched Next release is available.
