# BovistCommerce specification

## Overview
- Targets: quantity, add-to-cart, buy-now, cart drawer, stock state, related items.
- Source: `v2/public/bovist/product/chair-04/source.html` and cart capture.
- Interaction model: click/state driven; demo storefront without checkout mutation.

## Exact control measurements at 1440px
- Purchase wrapper: width 678.5px; height 166px; display flex.
- Quantity row: width 678.5px; height 38px; display flex.
- Quantity number input: 64 × 38px; starts at 1; minimum 1.
- Minus/plus controls: 19.1953px square; minus disabled at quantity 1.
- Add-to-cart: width 678.5px; height 56px.
- Buy-now: width 678.5px; height 56px.
- Related-card add-to-cart: height 56px.

## Behavior contract
- Product/variant/price/inventory remain Shopify-source fields.
- Quantity cannot fall below one.
- Out-of-stock disables purchase actions and exposes understandable status.
- Add-to-cart provides visible and screen-reader feedback.
- Cart state persists locally for the preview and remains consistent across pages.
- Cart drawer exposes item, quantity, remove, subtotal, shipping note, checkout.
- Checkout stays clearly marked as demo until Shopify configuration is supplied.
- Discount and subscription controls render only when supplied by commerce data.

## ROOSA integration
- Use Soma for presentation and this spec only for controls/state.
- Do not import Bovist catalogue density, furniture styling, or vendor complexity.

