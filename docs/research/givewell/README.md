# GiveWell 1:1 reference clone

Source: <https://givewell.webflow.io/>

Local route: <http://127.0.0.1:3000/givewell/index.html>

This directory records the literal source clone used as the first reference in the ROOSA implementation plan. It is not a visual reinterpretation. The served page is the captured Webflow document with the original stylesheets, media, Webflow runtime, and GSAP interaction code intact.

## Verification status

- Source document captured verbatim in `public/givewell/source.html`.
- `public/givewell/index.html` differs only by suppressing the Webflow badge that its runtime injects on localhost but not on the source domain.
- 41 source assets mirrored under `public/givewell/assets/` with their original bytes.
- Desktop viewport verified at 1440 × 1000.
- Mobile viewport verified at 375 × 812.
- Settled desktop source/local screenshots have identical SHA-256 hashes.
- Settled mobile source/local screenshots have identical SHA-256 hashes.
- Desktop source/local document height: 7,391 px.
- Source interaction code is preserved in full in `inline-interactions.js`.
- `npm run build` succeeds.

## Evidence

| View | Source | Local | SHA-256 |
| --- | --- | --- | --- |
| Desktop | `docs/design-references/givewell/desktop-top-settled.png` | `docs/design-references/givewell/local-desktop-top.png` | `30e776b382438cc263977c764839325e52504b91c228153cef22fbac4d5e8e16` |
| Mobile | `docs/design-references/givewell/mobile-source-top.png` | `docs/design-references/givewell/mobile-local-top.png` | `ab9c06290b2b582feb20e3d87c37e1adac94acab0c89c8ae92f6b7f088fb236f` |

The two files in each row are byte-for-byte identical.

## Research files

- `topology.json`: section positions, image inventory, backgrounds, fonts, scripts, and document height.
- `computed-desktop.json`: computed selector snapshots from the 1,440 px capture session.
- `computed-mobile.json`: computed selector snapshots from the 375 px capture session.
- `inline-interactions.js`: the four inline source scripts, including the complete GSAP setup.
- `PAGE_TOPOLOGY.md`: section order and measured geometry.
- `BEHAVIORS.md`: interaction and animation contract.
- `ASSET_REGISTER.md`: asset/runtime inventory and local mirror locations.
