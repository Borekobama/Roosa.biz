#!/usr/bin/env node
/**
 * Structural reconnaissance for the Solene template clone.
 * Measures layout, typography, color, spacing, motion and section topology
 * from a source route so the clone can reproduce its behaviour faithfully.
 * Writes JSON evidence under docs/research/<site-key>/<page-key>/.
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ORIGIN = process.env.RECON_ORIGIN ?? 'https://solene.framer.ai';
const SITE_KEY = process.env.RECON_SITE ?? 'solene-framer-ai';
const OUT_ROOT = join(process.cwd(), 'docs', 'research', SITE_KEY);
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const routes = process.argv.slice(2);
if (routes.length === 0) {
  console.error('usage: node tools/cloner/recon.mjs <route> [<route> ...]');
  process.exit(1);
}

const pageKey = (route) =>
  route === '/' ? 'home' : decodeURIComponent(route).replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();

/** Runs in the browser: collects the design + topology evidence for one viewport. */
function extract() {
  const px = (v) => (v && v !== 'none' ? v : null);
  const uniq = (arr) => [...new Set(arr.filter(Boolean))];

  const all = [...document.querySelectorAll('body *')];

  const typography = new Map();
  const colors = new Map();
  const backgrounds = new Map();
  const radii = new Map();
  const shadows = new Map();
  const transitions = [];
  const animations = [];

  for (const el of all) {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;

    const text = el.childNodes.length
      ? [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).length > 0
      : false;
    if (text) {
      const key = [cs.fontFamily, cs.fontSize, cs.fontWeight, cs.lineHeight, cs.letterSpacing, cs.textTransform].join(' | ');
      const rec = typography.get(key) ?? { fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, textTransform: cs.textTransform, color: cs.color, count: 0, sample: '' };
      rec.count += 1;
      if (!rec.sample) rec.sample = (el.textContent ?? '').trim().slice(0, 60);
      typography.set(key, rec);
    }

    colors.set(cs.color, (colors.get(cs.color) ?? 0) + 1);
    if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      backgrounds.set(cs.backgroundColor, (backgrounds.get(cs.backgroundColor) ?? 0) + 1);
    }
    if (cs.borderRadius && cs.borderRadius !== '0px') radii.set(cs.borderRadius, (radii.get(cs.borderRadius) ?? 0) + 1);
    if (px(cs.boxShadow)) shadows.set(cs.boxShadow, (shadows.get(cs.boxShadow) ?? 0) + 1);

    if (cs.transitionDuration && cs.transitionDuration !== '0s') {
      transitions.push({
        selector: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''),
        property: cs.transitionProperty,
        duration: cs.transitionDuration,
        timing: cs.transitionTimingFunction,
        delay: cs.transitionDelay,
      });
    }
    if (cs.animationName && cs.animationName !== 'none') {
      animations.push({ name: cs.animationName, duration: cs.animationDuration, timing: cs.animationTimingFunction, iteration: cs.animationIterationCount });
    }
  }

  // Top-level section topology
  const sectionRoots = [...document.querySelectorAll('body > div > div > *, main > *, body > main > *')];
  const sections = sectionRoots.map((el, i) => {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      index: i,
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      classes: typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 6) : [],
      top: Math.round(rect.top + window.scrollY),
      height: Math.round(rect.height),
      width: Math.round(rect.width),
      position: cs.position,
      zIndex: cs.zIndex,
      background: cs.backgroundColor,
      backgroundImage: px(cs.backgroundImage),
      display: cs.display,
      headings: [...el.querySelectorAll('h1,h2,h3,h4')].slice(0, 6).map((h) => ({ tag: h.tagName.toLowerCase(), text: (h.textContent ?? '').trim().slice(0, 90) })),
      imageCount: el.querySelectorAll('img').length,
      videoCount: el.querySelectorAll('video').length,
      linkCount: el.querySelectorAll('a').length,
      buttonCount: el.querySelectorAll('button').length,
    };
  });

  const images = [...document.querySelectorAll('img')].map((img) => {
    const rect = img.getBoundingClientRect();
    const cs = getComputedStyle(img);
    return {
      alt: img.alt || null,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      renderedWidth: Math.round(rect.width),
      renderedHeight: Math.round(rect.height),
      aspect: rect.height ? +(rect.width / rect.height).toFixed(3) : null,
      objectFit: cs.objectFit,
      borderRadius: cs.borderRadius,
      loading: img.loading,
      srcHost: (() => { try { return new URL(img.currentSrc || img.src).host; } catch { return null; } })(),
      srcPath: (() => { try { return new URL(img.currentSrc || img.src).pathname; } catch { return null; } })(),
    };
  });

  const videos = [...document.querySelectorAll('video')].map((v) => ({
    autoplay: v.autoplay, loop: v.loop, muted: v.muted, playsInline: v.playsInline,
    poster: v.poster ? new URL(v.poster, location.href).pathname : null,
    width: Math.round(v.getBoundingClientRect().width),
    height: Math.round(v.getBoundingClientRect().height),
    sources: [...v.querySelectorAll('source')].map((s) => ({ type: s.type, path: (() => { try { return new URL(s.src).pathname; } catch { return s.src; } })() })),
  }));

  const bgImages = uniq(all.map((el) => {
    const bi = getComputedStyle(el).backgroundImage;
    return bi && bi !== 'none' ? bi : null;
  })).slice(0, 60);

  const links = [...document.querySelectorAll('a')].map((a) => ({
    text: (a.textContent ?? '').trim().slice(0, 60),
    href: a.getAttribute('href'),
    target: a.target || null,
  }));

  const nav = (() => {
    const header = document.querySelector('header, nav, [role="banner"]') ?? document.body.firstElementChild;
    if (!header) return null;
    const cs = getComputedStyle(header);
    const rect = header.getBoundingClientRect();
    return {
      tag: header.tagName.toLowerCase(),
      position: cs.position,
      height: Math.round(rect.height),
      background: cs.backgroundColor,
      backdropFilter: cs.backdropFilter,
      zIndex: cs.zIndex,
      links: [...header.querySelectorAll('a')].map((a) => ({ text: (a.textContent ?? '').trim().slice(0, 40), href: a.getAttribute('href') })),
      buttons: [...header.querySelectorAll('button')].map((b) => ({ label: (b.getAttribute('aria-label') || b.textContent || '').trim().slice(0, 40) })),
    };
  })();

  const fonts = uniq([...typography.values()].map((t) => t.fontFamily));
  const fontFaces = [...document.styleSheets].flatMap((sheet) => {
    try { return [...sheet.cssRules].filter((r) => r.constructor.name === 'CSSFontFaceRule').map((r) => ({ family: r.style.fontFamily, weight: r.style.fontWeight, style: r.style.fontStyle, src: r.style.src?.slice(0, 200) })); }
    catch { return []; }
  });

  const body = getComputedStyle(document.body);

  return {
    url: location.href,
    title: document.title,
    meta: {
      description: document.querySelector('meta[name="description"]')?.content ?? null,
      ogImage: document.querySelector('meta[property="og:image"]')?.content ?? null,
      themeColor: document.querySelector('meta[name="theme-color"]')?.content ?? null,
      icons: [...document.querySelectorAll('link[rel*="icon"]')].map((l) => ({ rel: l.rel, href: l.href, sizes: l.getAttribute('sizes') })),
    },
    body: { background: body.backgroundColor, color: body.color, fontFamily: body.fontFamily, fontSize: body.fontSize },
    documentHeight: document.documentElement.scrollHeight,
    nav,
    sections,
    typography: [...typography.values()].sort((a, b) => b.count - a.count).slice(0, 40),
    colors: [...colors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([v, c]) => ({ value: v, count: c })),
    backgrounds: [...backgrounds.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([v, c]) => ({ value: v, count: c })),
    radii: [...radii.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15).map(([v, c]) => ({ value: v, count: c })),
    shadows: [...shadows.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([v, c]) => ({ value: v, count: c })),
    transitions: transitions.slice(0, 60),
    animations: animations.slice(0, 40),
    images,
    videos,
    backgroundImages: bgImages,
    links,
    fonts,
    fontFaces: fontFaces.slice(0, 40),
  };
}

const browser = await chromium.launch();

for (const route of routes) {
  const key = pageKey(route);
  const dir = join(OUT_ROOT, key);
  const shots = join(dir, 'screenshots');
  mkdirSync(shots, { recursive: true });

  const result = { route, origin: ORIGIN, capturedAt: new Date().toISOString(), viewports: {} };

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();
    const requests = [];
    page.on('response', (res) => {
      const u = new URL(res.url());
      requests.push({ host: u.host, path: u.pathname, type: res.request().resourceType(), status: res.status() });
    });

    await page.goto(ORIGIN + route, { waitUntil: 'networkidle', timeout: 90000 });
    // Settle entrance animations and lazy content.
    await page.evaluate(async () => {
      await new Promise((r) => setTimeout(r, 1200));
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.8) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 260));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 900));
    });

    const data = await page.evaluate(extract);
    data.network = requests.filter((r) => ['image', 'media', 'font', 'stylesheet'].includes(r.type)).slice(0, 200);
    result.viewports[vp.name] = data;

    await page.screenshot({ path: join(shots, `${vp.name}.png`), fullPage: true });
    await context.close();
    console.log(`  ${route} @ ${vp.name}: ${data.sections.length} sections, ${data.images.length} imgs, ${data.documentHeight}px`);
  }

  writeFileSync(join(dir, 'recon.json'), JSON.stringify(result, null, 2));
  console.log(`✔ ${route} -> docs/research/${SITE_KEY}/${key}/recon.json`);
}

await browser.close();
