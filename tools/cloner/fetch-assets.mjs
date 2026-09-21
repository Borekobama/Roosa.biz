#!/usr/bin/env node
/**
 * Asset extraction for the Solene clone.
 *
 * Visits every source route, enumerates the assets the page actually renders
 * (img currentSrc + srcset, <video>/<source>/poster, computed background-image,
 * inline SVG, webfonts, favicon/icon links), then downloads them into
 * public/assets/ with bounded concurrency and an explicit manifest.
 */
import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const ORIGIN = process.env.ASSET_ORIGIN ?? 'https://solene.framer.ai';
const OUT = join(process.cwd(), 'public', 'assets');
const MANIFEST = join(process.cwd(), 'docs', 'research', 'solene-framer-ai', 'ASSET_MANIFEST.json');
const CONCURRENCY = 4;

const ROUTES = [
  '/',
  '/science',
  '/merch',
  '/blog',
  '/cookies-policy',
  '/privacy-policy',
  '/merch/daily-multivitamin%E2%84%A2',
  '/merch/ecobag',
  '/merch/cap',
  '/merch/squeeze',
  '/merch/t-shirt',
  '/merch/pin',
  '/merch/poster',
  '/blog/how-the-body-generates-sustained-energy',
  '/blog/building-an-agroforestry-value-chain',
  '/blog/gummy-supplements',
  '/blog/the-science-of-muscle-recovery',
  '/blog/the-influence-of-micronutrients',
  '/blog/brazil%E2%80%99s-influence-on-solene%E2%80%99s-ingredients',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

/** Stable local filename: original basename + short hash of the full URL. */
function localName(url, contentType = '') {
  const u = new URL(url);
  const base = decodeURIComponent(u.pathname.split('/').pop() || 'asset');
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 8);
  let ext = extname(base);
  if (!ext) {
    const map = {
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/webp': '.webp',
      'image/avif': '.avif',
      'image/svg+xml': '.svg',
      'image/gif': '.gif',
      'video/mp4': '.mp4',
      'video/webm': '.webm',
      'font/woff2': '.woff2',
      'font/woff': '.woff',
    };
    ext = map[contentType.split(';')[0].trim()] ?? '';
  }
  const stem = (ext ? base.slice(0, -ext.length) : base).replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 60);
  return `${stem || 'asset'}-${hash}${ext}`;
}

function bucketFor(url, kind) {
  if (kind === 'font') return 'fonts';
  if (kind === 'video' || kind === 'poster') return 'video';
  if (kind === 'icon') return 'icons';
  if (url.endsWith('.svg')) return 'svg';
  return 'images';
}

/** Runs in the page: every asset reference the rendered document actually uses. */
function collect() {
  const abs = (v) => {
    try {
      return new URL(v, location.href).href;
    } catch {
      return null;
    }
  };
  const out = [];
  const push = (url, kind, meta = {}) => {
    if (!url) return;
    if (url.startsWith('data:') || url.startsWith('blob:')) return;
    out.push({ url, kind, ...meta });
  };

  for (const img of document.querySelectorAll('img')) {
    const r = img.getBoundingClientRect();
    const meta = {
      alt: img.alt || null,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      renderedWidth: Math.round(r.width),
      renderedHeight: Math.round(r.height),
      loading: img.loading || null,
      objectFit: getComputedStyle(img).objectFit,
      borderRadius: getComputedStyle(img).borderRadius,
    };
    push(abs(img.currentSrc || img.src), 'image', meta);
    // Keep the largest srcset candidate too, so we hold a full-resolution original.
    const candidates = (img.getAttribute('srcset') || '')
      .split(',')
      .map((s) => s.trim().split(/\s+/))
      .filter((p) => p[0]);
    let best = null;
    let bestW = 0;
    for (const [u, d] of candidates) {
      const w = d && d.endsWith('w') ? parseInt(d, 10) : 0;
      if (w >= bestW) {
        bestW = w;
        best = u;
      }
    }
    if (best) push(abs(best), 'image', { ...meta, variant: 'srcset-max', srcsetWidth: bestW });
  }

  for (const v of document.querySelectorAll('video')) {
    push(abs(v.poster), 'poster', {});
    push(abs(v.src), 'video', { autoplay: v.autoplay, loop: v.loop, muted: v.muted });
    for (const s of v.querySelectorAll('source')) push(abs(s.src), 'video', { type: s.type });
  }

  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    for (const prop of ['backgroundImage', 'maskImage', 'borderImageSource']) {
      const val = cs[prop];
      if (!val || val === 'none') continue;
      for (const m of val.matchAll(/url\((['"]?)(.*?)\1\)/g)) push(abs(m[2]), 'background', { prop });
    }
  }

  for (const link of document.querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')) {
    push(abs(link.getAttribute('href')), 'icon', { rel: link.rel, sizes: link.getAttribute('sizes') });
  }

  for (const meta of document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]')) {
    push(abs(meta.getAttribute('content')), 'icon', { rel: 'og' });
  }

  // Inline SVG markup is captured verbatim rather than downloaded.
  const inlineSvg = [...document.querySelectorAll('svg')]
    .filter((s) => !s.closest('[data-framer-component-type="Image"]'))
    .slice(0, 80)
    .map((s) => ({
      outer: s.outerHTML.slice(0, 4000),
      width: Math.round(s.getBoundingClientRect().width),
      height: Math.round(s.getBoundingClientRect().height),
      viewBox: s.getAttribute('viewBox'),
      ariaLabel: s.getAttribute('aria-label'),
    }));

  return { assets: out, inlineSvg };
}

mkdirSync(OUT, { recursive: true });
for (const b of ['images', 'video', 'fonts', 'icons', 'svg']) mkdirSync(join(OUT, b), { recursive: true });

const browser = await chromium.launch();
/** url -> { kind, routes:Set, meta[] } */
const discovered = new Map();
const inlineSvgByRoute = {};
const networkFonts = new Set();

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  });

  for (const route of ROUTES) {
    const page = await context.newPage();
    page.on('response', (res) => {
      const t = res.request().resourceType();
      if (t === 'font') networkFonts.add(res.url());
      if (t === 'image' || t === 'media') {
        const u = res.url();
        if (!u.startsWith('data:') && !discovered.has(u)) {
          discovered.set(u, { kind: t === 'media' ? 'video' : 'image', routes: new Set([route]), meta: [] });
        }
      }
    });

    try {
      await page.goto(ORIGIN + route, { waitUntil: 'networkidle', timeout: 90000 });
    } catch (error) {
      console.error(`  ! ${route} @ ${vp.name}: ${error.message.split('\n')[0]}`);
      await page.close();
      continue;
    }

    await page.evaluate(async () => {
      await new Promise((r) => setTimeout(r, 900));
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.75) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 220));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 700));
    });

    const { assets, inlineSvg } = await page.evaluate(collect);
    for (const a of assets) {
      const entry = discovered.get(a.url) ?? { kind: a.kind, routes: new Set(), meta: [] };
      entry.kind = entry.kind === 'image' && a.kind !== 'image' ? a.kind : entry.kind;
      entry.routes.add(route);
      const { url, kind, ...rest } = a;
      if (Object.keys(rest).length) entry.meta.push({ viewport: vp.name, route, ...rest });
      discovered.set(a.url, entry);
    }
    if (vp.name === 'desktop') inlineSvgByRoute[route] = inlineSvg;

    console.log(`  ${route} @ ${vp.name}: +${assets.length} refs`);
    await page.close();
  }

  await context.close();
}

for (const f of networkFonts) {
  if (!discovered.has(f)) discovered.set(f, { kind: 'font', routes: new Set(['*']), meta: [] });
}

await browser.close();

/* ------------------------------------------------------------- download */
const urls = [...discovered.keys()];
console.log(`\nDownloading ${urls.length} assets (concurrency ${CONCURRENCY})...`);

const manifest = [];
const failures = [];
let done = 0;

async function download(url) {
  const entry = discovered.get(url);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Referer: ORIGIN + '/',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get('content-type') ?? '';
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) throw new Error('empty body');

    const name = localName(url, contentType);
    const bucket = bucketFor(url, entry.kind);
    const rel = `assets/${bucket}/${name}`;
    const dest = join(OUT, bucket, name);
    if (!existsSync(dest)) writeFileSync(dest, buf);

    manifest.push({
      source: url,
      local: `/${rel}`,
      kind: entry.kind,
      bytes: buf.length,
      contentType: contentType.split(';')[0].trim(),
      routes: [...entry.routes],
      meta: entry.meta.slice(0, 4),
    });
  } catch (error) {
    failures.push({ source: url, kind: entry.kind, error: String(error.message ?? error) });
  } finally {
    done += 1;
    if (done % 25 === 0) console.log(`  ${done}/${urls.length}`);
  }
}

const queue = [...urls];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) await download(queue.shift());
  }),
);

mkdirSync(join(process.cwd(), 'docs', 'research', 'solene-framer-ai'), { recursive: true });
writeFileSync(
  MANIFEST,
  JSON.stringify(
    {
      origin: ORIGIN,
      capturedAt: new Date().toISOString(),
      note: 'Assets downloaded from the source template. Third-party material — licence or replace before public or commercial use.',
      counts: {
        discovered: urls.length,
        downloaded: manifest.length,
        failed: failures.length,
        byKind: manifest.reduce((acc, m) => ({ ...acc, [m.kind]: (acc[m.kind] ?? 0) + 1 }), {}),
      },
      assets: manifest.sort((a, b) => a.local.localeCompare(b.local)),
      failures,
      inlineSvgByRoute,
    },
    null,
    2,
  ),
);

console.log(`\n✔ downloaded ${manifest.length}/${urls.length}`);
if (failures.length) {
  console.error(`✖ ${failures.length} failed:`);
  for (const f of failures.slice(0, 10)) console.error(`  ${f.error} — ${f.source.slice(0, 110)}`);
}
console.log(`manifest: docs/research/solene-framer-ai/ASSET_MANIFEST.json`);
