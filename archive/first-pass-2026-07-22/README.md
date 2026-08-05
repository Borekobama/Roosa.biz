# ROOSA website redesign

Production-style Next.js implementation of the supplied ROOSA redesign plan. The site is product-first, localized, responsive, progressively enhanced and built around the “Pink Paper Trail” concept.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` (redirects to `/en`).

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## External launch dependencies

The repository deliberately does not contain private credentials or invented product/impact/legal facts. Configure the public Shopify Storefront endpoint through `.env.local` after the client supplies approved values. See `docs/PLACEHOLDERS.md` and `docs/KNOWN_ISSUES.md`.

First-party media was migrated from the existing ROOSA site by `scripts/download-assets.mjs`. Template-reference code and media were not copied.
