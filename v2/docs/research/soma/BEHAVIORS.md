# Soma behavior contract

- Webflow owns the responsive navigation, interaction IDs, forms, and the visible Made in Webflow badge.
- CartGenie owns product hydration, price/sale state, variant selection, quantity, cart drawer, totals, and Stripe handoff.
- The source declares USD currency formatting and retains the original CartGenie element attributes on every captured route.
- The home page contains 18 Webflow interaction IDs, one responsive navigation component, three forms, and 27 detected cart-related elements/hooks.
- Montserrat is loaded through WebFont; the editorial serif and remaining typography are inherited from the source stylesheet.
- The clone keeps all original hover, transition, menu, product-card, journal-card, and cart-drawer behavior because it serves the same runtime and DOM.
- Internal navigation is the only intentional markup rewrite: source-origin links point to the corresponding `/soma/.../index.html` files.

Checkout remains the original template's third-party flow. It is preserved as a reference behavior, not treated as a production ROOSA checkout.

