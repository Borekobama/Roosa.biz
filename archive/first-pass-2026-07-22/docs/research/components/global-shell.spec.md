# GlobalShell specification

## Overview

- Target files: `src/components/SiteHeader.tsx`, `MobileMenu.tsx`, `SiteFooter.tsx`, `CartDrawer.tsx`.
- Interaction model: scroll + click.

## DOM structure

Announcement, sticky header, logo/nav/actions, main slot, cart dialog, footer.

## Exact implementation values

- Announcement: 32px min-height, graphite background, paper text, 12px uppercase label.
- Header: 76px desktop / 64px mobile, z-index 50, 24px scroll trigger.
- Container: min(100% - 40px, 1360px); mobile gutters 20px.
- Drawer: min(100vw, 460px), full-height, paper background, 24px padding.
- Focus ring: 3px pink outline with 3px offset.

## States

- Transparent / scrolled header.
- Closed / open menu and cart.
- Empty / populated cart.
- Shopify configured / not configured checkout.

## Responsive behavior

- Desktop navigation visible from 992px.
- Mobile controls visible below 992px.
- Footer: 6 columns desktop, 2 tablet, 1 mobile.
