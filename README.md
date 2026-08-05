# ROOSA reference-first redesign

The previous interpreted design has been archived under `archive/first-pass-2026-07-22/`.

The project follows a strict two-stage workflow:

1. Capture every reference website literally and verify its behavior and responsive layout. Complete.
2. Build the ROOSA adaptation by transferring only the systems assigned to each reference. In progress.

## Active ROOSA implementation

- Homepage: <http://127.0.0.1:3000/en>
- Shop: <http://127.0.0.1:3000/en/shop>
- Product: <http://127.0.0.1:3000/en/product/pink-toilet-paper>
- Impact: <http://127.0.0.1:3000/en/impact>

The active implementation combines GiveWell's editorial impact rhythm, Soma's store/product proportions, Bovist's cart and quantity patterns, the Coca-Cola reference's singular product-scale hero movement, and Sitasys-style masks/transitions. Business values that have not been supplied remain explicit placeholders.

## Captured references

- GiveWell: <http://127.0.0.1:3000/givewell/index.html>
- Soma / CartGenie: <http://127.0.0.1:3000/soma/index.html>
- Bovist / Smootify: <http://127.0.0.1:3000/bovist/index.html>
- Coca-Cola 3D: <http://127.0.0.1:3000/coca-cola-3d/index.html>
- Sitasys Interactions: <http://127.0.0.1:3000/sitasys/index.html>

The root route continues to redirect to GiveWell, the first reference in the implementation plan.

## Run locally

```bash
npm install
npm run dev
```

## Verification

```bash
npm run build
npm run lint
```

See `docs/research/givewell/README.md` for source topology, interaction behavior, asset inventory, and pixel-identity evidence.
