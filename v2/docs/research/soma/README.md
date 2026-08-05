# Soma / CartGenie 1:1 reference clone

Source: <https://cartgenie-template-soma.webflow.io/>

Local home: <http://127.0.0.1:3000/soma/index.html>

This is a literal multi-page capture of the commerce reference. Internal links are rewritten only so they stay inside `/soma/`; markup, styles, media URLs, CartGenie hooks, Webflow interactions, and third-party runtimes remain unchanged.

## Capture coverage

- 32 unique local routes.
- 32 untouched `source.html` documents and 32 locally linked `index.html` documents.
- Home, store, 12 product pages, 3 product categories, journal index, 4 posts, 3 journal categories, about, contact, FAQ, terms, licenses, and style guide.
- 74 discovered external asset/runtime URLs; 70 were archived successfully.
- The four failed records are non-file preconnect origins plus a CDN placeholder that returns HTTP 403. They are listed explicitly in `manifest.json`.

## Visual verification

| Route/view | Source/local result |
| --- | --- |
| Home, 1,440 × 1,000 | Byte-identical PNG, SHA-256 `384150d09cc811fc68b811221fc509f64c17149faf12e8e2d5331fedf91bcbd4` |
| Home, 375 × 812 | Byte-identical PNG, SHA-256 `cb9abc465397584afab874bc1dd8c41f53fc69fe0ce0d208a92e6e8d19c9fbdd` |
| Store, 1,440 × 1,000 | Byte-identical PNG, SHA-256 `e20e096a313c104824e4879552f58e220a93ae7e91ee7068f100560c67b34e0c` |
| Journal, 1,440 × 1,000 | Byte-identical PNG, SHA-256 `97b6336edce1e06671e5c799db238bec8bfff6b5202a16077bfcba853e2d49cc` |
| About, 1,440 × 1,000 | Byte-identical PNG, SHA-256 `ce54689435f10ee7128f25065fc17fb66844f0d90ca27f9ebe690b5bcd7ca33c` |
| Product detail, 1,440 × 1,000 | Same geometry and height; 99.9936% of raw RGB channel bytes identical after live CartGenie initialization |

Home heights match at 5,993 px desktop and 6,656 px mobile. Store, journal, about, and sampled product-detail heights also match exactly.

## Evidence and inventories

- `manifest.json`: route and asset archive map.
- `home-topology.json`: source links, styles, scripts, imagery, and initial page metrics.
- `home-structure.json`: measured homepage section geometry.
- `home-interactions.json`: Webflow IDs, forms, navigation, and CartGenie hooks.
- `home-inline-scripts.json`: inline font, Webflow mode, and currency setup.
- `route-verification.json`: representative source/local route checks.
- Screenshots: `docs/design-references/soma/`.

