# SomaStore specification

## Overview
- Targets: ROOSA product-options section plus v2 shop/product routes.
- Source: `v2/public/soma/store/index.html` and product captures.
- Screenshots: `v2/docs/design-references/soma/store-desktop-source.png` and
  `product-siberian-fir-body-scrub-desktop-source.png`.
- Interaction model: link + hover image; CartGenie hooks become local demo hooks.

## Exact desktop product-grid measurements (1440px)
- Grid/list width: 1110px; display flex; margin `0 -15px`.
- Card width: 369.992px; height 524.984px; padding `0 15px`;
  margin-bottom 60px; display flex.
- Media link: 339.992 × 424.984px; margin-bottom 30px; position relative;
  overflow hidden; border radius 0.
- Product heading: 339.992 × 35px; font 24px/35px, weight 400;
  margin-bottom 5px.
- Source font: `Sorts Mill Goudy`, Verdana, sans-serif.
- Default and hover product images occupy the same frame; hover swaps opacity.

## ROOSA content
- Standard pack, family bundle, subscription (only if operational), and B2B.
- Every item displays image, title, `[PRODUCT_PRICE]`, pack information,
  purchase action, and `[STOCK_STATUS]`.
- Use only `v2/public/media/products/*` assets.
- No cosmetics copy, sale claims, reviews, or fabricated prices.

## Integration rule
- Preserve Soma geometry and whitespace inside the inserted store module.
- ROOSA type/color treatment may replace Soma’s earthy styling, but proportions,
  image-hover structure, column count, and responsive stacking stay source-led.
- Desktop: three columns; tablet: two; mobile: one.

