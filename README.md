# ROOSA website

The client-facing application is the self-contained Next.js project in `v6/`.
Docker Compose and the deployment scripts build that directory; the root app and
`v2/` through `v5/` are preserved design iterations and are not used at runtime.

The previous interpreted design has been archived under `archive/first-pass-2026-07-22/`.

The project follows a strict two-stage workflow:

1. Capture every reference website literally and verify its behavior and responsive layout. Complete.
2. Build the ROOSA adaptation by transferring only the systems assigned to each reference. In progress.

## Active ROOSA implementation (V6)

- Homepage: <http://127.0.0.1:3005/en>
- Shop: <http://127.0.0.1:3005/en/shop>
- Product: <http://127.0.0.1:3005/en/product/pink-toilet-paper>
- Impact: <http://127.0.0.1:3005/en/impact>

The active implementation combines GiveWell's editorial impact rhythm, Soma's store/product proportions, Bovist's cart and quantity patterns, the Coca-Cola reference's singular product-scale hero movement, and Sitasys-style masks/transitions. Business values that have not been supplied remain explicit placeholders.

## Captured references

- GiveWell: <http://127.0.0.1:3005/givewell/index.html>
- Soma / CartGenie: <http://127.0.0.1:3005/soma/index.html>
- Bovist / Smootify: <http://127.0.0.1:3005/bovist/index.html>
- Coca-Cola 3D: <http://127.0.0.1:3005/coca-cola-3d/index.html>
- Sitasys Interactions: <http://127.0.0.1:3005/sitasys/index.html>

The public root route serves the V6 homepage.

## Run locally

```bash
npm --prefix v6 install
npm --prefix v6 run dev
```

## Verification

```bash
npm --prefix v6 run build
npm --prefix v6 run lint
```

See `v6/README.md` for the current route architecture, generator chain and browser QA.
