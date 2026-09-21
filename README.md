# ROOSA website

ROOSA's Next.js website. The application lives at the repository root and serves `/` directly. It uses the Solene Framer layout as a design reference, with ROOSA content and assets.

## Run locally

```bash
npm ci
npm run dev
```

Development runs at http://localhost:3111. To verify the production build:

```bash
npm run build
npm run start
```

`npm run start` uses port 3000 by default. Set `PORT` to choose another port.

## Routes

- `/` homepage
- `/science` mission
- `/merch` shop and `/merch/[slug]` products
- `/blog` news and `/blog/[slug]` articles
- `/privacy-policy` and `/cookies-policy`

Product images live in `public/assets/images`. Edit asset mappings in `src/lib/assets.ts` and product copy in `src/lib/content.ts`.
