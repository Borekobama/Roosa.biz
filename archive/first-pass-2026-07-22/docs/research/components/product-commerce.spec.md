# ProductCommerce specification

## Overview

- Targets: `ProductCard.tsx`, `ProductModule.tsx`, `QuantityControl.tsx`, `CartDrawer.tsx`.
- Interaction model: click + hover.

## Exact implementation values

- Product-card media aspect ratio: 4/5.
- Grid: 3 columns desktop, 2 tablet, 1 mobile; 24px gap.
- Purchase panel desktop: 44% width; 32px gap.
- Buttons: 48px minimum target; primary graphite/paper, hover pink.

## States

- Unknown stock: purchase CTA stays disabled and explains that Shopify data is required.
- Quantity floor: 1.
- Add success: drawer opens and live region announces the result.
- Product image hover: alternate crossfade and 2deg rotation, 320ms.

## Assets

- `public/media/products/*` from current ROOSA site.

## Responsive behavior

- Product gallery precedes details below 768px.
- Sticky purchase bar enabled below 768px on product pages.
