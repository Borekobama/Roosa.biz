#!/usr/bin/env node
/**
 * Clone verification harness.
 *
 * Loads every route of the running clone at three viewports, captures
 * screenshots, collects console/page/network errors, and exercises the
 * interactive controls (mobile menu, FAQ accordion, nav, in-page anchors).
 * Exits non-zero when any check fails.
 */
import { chromium } from 'playwright';
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Port 3111, not 3000: another app on this machine answers on 3000, and a run
// pointed there grades that site instead of failing.
const BASE = process.env.VERIFY_BASE ?? 'http://localhost:3111';
// Screenshots dominate sweep time; VERIFY_SHOTS=0 runs the assertions only.
const SHOTS = process.env.VERIFY_SHOTS !== '0';
// VERIFY_ONLY=interactions skips the 3-viewport route sweep; =sweep skips checks.
const ONLY = process.env.VERIFY_ONLY ?? 'all';
const OUT = join(process.cwd(), 'docs', 'research', '_verify');
const SHOTS_DIR = join(OUT, 'screenshots');

const ROUTES = [
  '/',
  '/science',
  '/merch',
  '/merch/daily-multivitamin',
  '/merch/ecobag',
  '/merch/cap',
  '/merch/squeeze',
  '/merch/t-shirt',
  '/merch/pin',
  '/merch/poster',
  '/blog',
  '/blog/sustained-energy-and-the-nutrients-behind-it',
  '/blog/why-mornings-matter-for-daily-nutrition',
  '/blog/building-a-traceable-value-chain',
  '/blog/reading-a-supplement-label',
  '/blog/the-science-of-recovery',
  '/blog/the-influence-of-micronutrients',
  '/cookies-policy',
  '/privacy-policy',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

mkdirSync(SHOTS_DIR, { recursive: true });

const failures = [];
const report = { base: BASE, ranAt: new Date().toISOString(), routes: {}, interactions: {} };
const fail = (scope, message) => {
  failures.push(`${scope}: ${message}`);
  console.error(`  ✖ ${scope}: ${message}`);
};

const browser = await chromium.launch();

/**
 * Preflight: a server started before the last build serves an HTML manifest
 * whose stylesheet no longer exists on disk. Tailwind then never loads, so
 * every layout assertion silently measures unstyled markup. Fail loudly.
 */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute('href')),
  );
  if (hrefs.length === 0) {
    console.error('PREFLIGHT FAILED: page references no stylesheet (stale build?)');
    process.exit(2);
  }
  for (const href of hrefs) {
    const res = await page.request.get(new URL(href, BASE).href);
    if (res.status() !== 200) {
      console.error(`PREFLIGHT FAILED: stylesheet ${href} returned ${res.status()} — stale build. Rebuild and restart the server.`);
      process.exit(2);
    }
  }
  const sticky = await page.evaluate(() => {
    const el = document.querySelector('.sticky');
    return el ? getComputedStyle(el).position : null;
  });
  if (sticky && sticky !== 'sticky') {
    console.error(`PREFLIGHT FAILED: .sticky computes as "${sticky}" — CSS not applied (stale build).`);
    process.exit(2);
  }
  await ctx.close();
  console.log('preflight ok: stylesheet resolves and utilities apply');
}

/* ---------------------------------------------------------------- routes */
for (const vp of ONLY === 'interactions' ? [] : VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });

  for (const route of ROUTES) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const badResponses = [];

    page.on('console', (msg) => msg.type() === 'error' && consoleErrors.push(msg.text()));
    page.on('pageerror', (err) => pageErrors.push(String(err)));
    page.on('response', (res) => {
      if (res.status() >= 400) badResponses.push(`${res.status()} ${new URL(res.url()).pathname}`);
    });

    const response = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.9) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });

    const key = `${route}@${vp.name}`;
    const status = response?.status() ?? 0;
    if (status !== 200) fail(key, `HTTP ${status}`);
    if (pageErrors.length) fail(key, `page errors: ${pageErrors.slice(0, 2).join(' | ')}`);
    if (consoleErrors.length) fail(key, `console errors: ${consoleErrors.slice(0, 2).join(' | ')}`);
    if (badResponses.length) fail(key, `failed requests: ${badResponses.slice(0, 3).join(', ')}`);

    const metrics = await page.evaluate(() => {
      const de = document.documentElement;
      const heading = document.querySelector('h1');
      return {
        docHeight: de.scrollHeight,
        scrollWidth: de.scrollWidth,
        clientWidth: de.clientWidth,
        title: document.title,
        h1Count: document.querySelectorAll('h1').length,
        h1: heading ? heading.textContent.trim().slice(0, 80) : null,
        headerFixed: (() => {
          const h = document.querySelector('header');
          return h ? getComputedStyle(h).position : null;
        })(),
        bodyBg: getComputedStyle(document.body).backgroundColor,
        imgAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
        links: document.querySelectorAll('a').length,
      };
    });

    // Horizontal overflow is a hard responsive failure.
    if (metrics.scrollWidth > metrics.clientWidth + 1) {
      fail(key, `horizontal overflow: scrollWidth ${metrics.scrollWidth} > ${metrics.clientWidth}`);
    }
    // The source uses multiple h1s per page (ingredient rows, closing CTA), so
    // this asserts presence rather than a single heading.
    if (metrics.h1Count < 1) fail(key, 'no <h1> on the page');
    if (metrics.headerFixed !== 'fixed') fail(key, `header position is ${metrics.headerFixed}`);
    if (metrics.imgAlt > 0) fail(key, `${metrics.imgAlt} <img> without alt`);

    report.routes[key] = { status, ...metrics, consoleErrors, pageErrors, badResponses };

    if (SHOTS) {
      await page.screenshot({
        path: join(SHOTS_DIR, `${route === '/' ? 'home' : route.slice(1).replace(/\//g, '_')}-${vp.name}.png`),
        fullPage: true,
      });
    }
    await page.close();
  }

  await context.close();
  console.log(`✔ swept ${ROUTES.length} routes @ ${vp.name}`);
}

/* ---------------------------------------------------------- interactions */
let checkContext = null;
const TRACE = process.env.VERIFY_TRACE;
const trace = (line) => {
  if (TRACE) appendFileSync(TRACE, `${new Date().toISOString()} ${line}\n`);
};

async function check(name, fn) {
  if (ONLY === 'sweep') return;
  // A fresh page per check, but one shared context: creating a context per
  // check dominated runtime once the real (multi-megabyte) assets landed.
  if (!checkContext) {
    checkContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  }
  const page = await checkContext.newPage();
  const started = Date.now();
  trace(`START ${name}`);
  try {
    const detail = await fn(page);
    trace(`OK    ${name} (${Date.now() - started}ms)`);
    report.interactions[name] = { ok: true, detail };
    console.log(`✔ ${name}${detail ? ` — ${detail}` : ''}`);
  } catch (error) {
    report.interactions[name] = { ok: false, error: String(error.message ?? error) };
    trace(`FAIL  ${name} (${Date.now() - started}ms) ${String(error.message ?? error).split('\n')[0]}`);
    fail(`interaction/${name}`, String(error.message ?? error));
  } finally {
    await page.close();
    // Reset emulation-affecting state by dropping the context after checks
    // that change it.
    if (/reduced motion/.test(name)) {
      await checkContext.close();
      checkContext = null;
    }
  }
}

/** Scroll without Playwright's stability gate, for perpetually animating elements. */
async function scrollTo(page, selector) {
  await page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ block: 'center', behavior: 'instant' });
  }, selector);
  await page.waitForTimeout(250);
}

const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

await check('nav: every primary link resolves', async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  for (const label of ['Science', 'Blog', 'Merch']) {
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: label }).click();
    await page.waitForURL(`**/${label.toLowerCase()}`, { timeout: 15000 });
    assert(
      new URL(page.url()).pathname === `/${label.toLowerCase()}`,
      `${label} went to ${page.url()}`,
    );
  }
  return 'Science, Blog, Merch';
});

await check('nav: Buy Offer scrolls to #product-offer', async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('banner').getByRole('link', { name: 'Buy Offer' }).click();
  const y = await page.evaluate(async () => {
    const el = document.querySelector('#product-offer');
    if (!el) return null;
    let last = NaN;
    for (let i = 0; i < 60; i += 1) {
      await new Promise((r) => setTimeout(r, 150));
      const now = Math.round(window.scrollY);
      if (now === last) break;
      last = now;
    }
    return Math.round(el.getBoundingClientRect().top);
  });
  assert(y !== null, '#product-offer missing');
  assert(Math.abs(y) < 160, `anchor landed ${y}px from viewport top`);
  return `offset ${y}px`;
});

await check('faq: rows open independently and close again', async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const first = page.locator('[id^="faq-trigger-"]').first();
  const second = page.locator('[id^="faq-trigger-"]').nth(1);
  await first.scrollIntoViewIfNeeded();

  // The source opens with every row collapsed.
  assert((await first.getAttribute('aria-expanded')) === 'false', 'panels should start collapsed');
  await first.click();
  await page.waitForTimeout(250);
  assert((await first.getAttribute('aria-expanded')) === 'true', 'first panel did not open');
  await second.click();
  await page.waitForTimeout(350);
  assert((await second.getAttribute('aria-expanded')) === 'true', 'second panel did not open');
  assert(
    (await first.getAttribute('aria-expanded')) === 'true',
    'opening a row closed another; rows are independent on the source',
  );

  await second.click();
  await page.waitForTimeout(350);
  assert((await second.getAttribute('aria-expanded')) === 'false', 'second panel did not close');
  assert((await first.getAttribute('aria-expanded')) === 'true', 'closing one row closed another');
  return 'independent open/close verified';
});

await check('mobile: menu toggles, locks scroll and closes on navigate', async (page) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });

  const toggle = page.getByRole('button', { name: 'Open menu' });
  assert(await toggle.isVisible(), 'menu button hidden at 390px');
  assert(!(await page.locator('#mobile-menu').isVisible()), 'menu visible before opening');

  await toggle.click();
  await page.waitForTimeout(250);
  assert(await page.locator('#mobile-menu').isVisible(), 'menu did not open');
  assert(
    (await page.evaluate(() => document.body.style.overflow)) === 'hidden',
    'body scroll not locked',
  );

  await page.locator('#mobile-menu').getByRole('link', { name: 'Merch' }).click();
  await page.waitForURL('**/merch', { timeout: 15000 });
  assert(new URL(page.url()).pathname === '/merch', `navigated to ${page.url()}`);
  await page.waitForTimeout(250);
  assert(!(await page.locator('#mobile-menu').isVisible()), 'menu stayed open after navigation');
  return 'toggle, scroll-lock, auto-close';
});

await check('mobile: Escape closes the menu', async (page) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(200);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  assert(!(await page.locator('#mobile-menu').isVisible()), 'Escape did not close the menu');
  return 'Escape handled';
});

await check('merch: card click reaches the product detail page', async (page) => {
  await page.goto(BASE + '/merch', { waitUntil: 'domcontentloaded' });
  const cards = page.locator('main a[href^="/merch/"]');
  const count = await cards.count();
  assert(count >= 7, `expected 7 product cards, found ${count}`);
  await cards.first().click();
  await page.waitForURL(/\/merch\/.+/, { timeout: 15000 });
  assert(/^\/merch\/.+/.test(new URL(page.url()).pathname), `landed on ${page.url()}`);
  assert((await page.locator('h1').count()) === 1, 'detail page h1 missing');
  return `${count} cards, detail reachable`;
});

await check('blog: card click reaches the article page', async (page) => {
  await page.goto(BASE + '/blog', { waitUntil: 'domcontentloaded' });
  const cards = page.locator('main a[href^="/blog/"]');
  const count = await cards.count();
  assert(count >= 6, `expected 6 post links, found ${count}`);
  await cards.first().click();
  await page.waitForURL(/\/blog\/.+/, { timeout: 15000 });
  assert(/^\/blog\/.+/.test(new URL(page.url()).pathname), `landed on ${page.url()}`);
  assert((await page.locator('article p').count()) >= 4, 'article body too short');
  return `${count} posts, article reachable`;
});

await check('motion: scroll reveal transitions elements to visible', async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const target = page.locator('#faq h2').first();
  await target.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const opacity = await target.evaluate((el) => {
    let node = el;
    while (node && node !== document.body) {
      const o = node.style.opacity;
      if (o !== '') return Number(o);
      node = node.parentElement;
    }
    return 1;
  });
  assert(opacity === 1, `reveal stuck at opacity ${opacity}`);
  return 'reveal reaches opacity 1';
});

await check('a11y: reduced motion still reveals content', async (page) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('main div[style*="opacity"]')]
      .filter((el) => !el.closest('aside[aria-label="Your cart"]'))
      // Branches hidden at this breakpoint, and collapsed disclosure panels,
      // are not content lost to reduced motion.
      .filter((el) => el.offsetParent !== null)
      .filter((el) => el.getBoundingClientRect().height > 0)
      .filter((el) => Number(el.style.opacity) === 0)
      // Inactive panels of the pinned sequence are cross-faded by design.
      .filter((el) => !el.closest('section[aria-label="How Solene fits your day"]')).length,
  );
  assert(hidden === 0, `${hidden} element(s) remain hidden under reduced motion`);
  return 'no content hidden';
});

await check('reveal: anchor landing does not leave content invisible', async (page) => {
  await page.goto(BASE + '/#faq', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  const stuck = await page.evaluate(() => {
    const h = document.querySelector('#faq h2');
    let n = h;
    while (n && n !== document.body) {
      if (n.style.opacity !== '' && Number(n.style.opacity) === 0) return true;
      n = n.parentElement;
    }
    return false;
  });
  assert(!stuck, 'FAQ heading stayed at opacity 0 after an anchor landing');
  return 'anchor landing reveals content';
});

await check('a11y: skip link focuses main content', async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
  assert(focused === 'Skip to content', `first tab stop is "${focused}"`);
  return 'skip link is first tab stop';
});

await check('assets: every image decodes from the local asset store', async (page) => {
  const routes = ['/', '/science', '/merch', '/merch/cap', '/blog', '/blog/the-science-of-recovery'];
  let total = 0;
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.8) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 140));
      }
    });
    await page.waitForTimeout(600);

    const stats = await page.evaluate(async () => {
      const withTimeout = (promise, ms) =>
        Promise.race([promise, new Promise((r) => setTimeout(r, ms))]);
      const imgs = [...document.querySelectorAll('img')];
      await Promise.all(
        imgs.map((i) => (i.decode ? withTimeout(i.decode().catch(() => {}), 4000) : null)),
      );
      return {
        total: imgs.length,
        broken: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
        placeholderSvg: imgs.filter((i) => (i.currentSrc || i.src).startsWith('data:image/svg')).length,
        fromAssetStore: imgs.filter((i) => {
          const u = i.currentSrc || i.src;
          return u.includes('/assets/') || u.includes('%2Fassets%2F');
        }).length,
      };
    });

    assert(stats.total > 0, `${route} rendered no <img>`);
    assert(stats.broken.length === 0, `${route}: ${stats.broken.length} broken image(s) — ${stats.broken[0] ?? ''}`);
    assert(
      stats.fromAssetStore === stats.total,
      `${route}: ${stats.total - stats.fromAssetStore}/${stats.total} images are not served from /assets/`,
    );
    total += stats.total;
  }
  return `${total} images decoded across ${routes.length} routes`;
});

await check('assets: no generated placeholder artwork remains', async (page) => {
  const routes = ['/', '/science', '/merch', '/blog'];
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
    const leftovers = await page.evaluate(() =>
      [...document.querySelectorAll('[role="img"][aria-label*="placeholder" i]')].length,
    );
    assert(leftovers === 0, `${route} still renders ${leftovers} placeholder block(s)`);
  }
  return 'no placeholders on any swept route';
});

await check('brand: wordmark renders in header and footer', async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.querySelector('footer')?.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(900);

  const marks = await page.evaluate(async () => {
    const withTimeout = (promise, ms) =>
      Promise.race([promise, new Promise((r) => setTimeout(r, ms))]);
    const headerMark = document.querySelector('header a[aria-label]');
    const footerImgs = [...document.querySelectorAll('footer img')];
    await Promise.all(
      footerImgs.map((i) => (i.decode ? withTimeout(i.decode().catch(() => {}), 4000) : null)),
    );
    return {
      headerText: (headerMark?.textContent || '').trim(),
      headerWidth: headerMark ? Math.round(headerMark.getBoundingClientRect().width) : 0,
      footerDecoded: footerImgs.filter((i) => i.naturalWidth > 0).length,
      footerTotal: footerImgs.length,
    };
  });

  // The header mark is set as text: the source draws its logotype as vector
  // artwork, which this template does not reconstruct.
  assert(/solene/i.test(marks.headerText), `header wordmark text is "${marks.headerText}"`);
  assert(marks.headerWidth > 80, `header wordmark is only ${marks.headerWidth}px wide`);
  assert(
    marks.footerTotal === 0 || marks.footerDecoded === marks.footerTotal,
    `${marks.footerTotal - marks.footerDecoded} footer image(s) failed to decode`,
  );
  return `header "${marks.headerText}" ${marks.headerWidth}px, ${marks.footerDecoded}/${marks.footerTotal} footer images`;
});

await check('favicon: the real icon is linked and reachable', async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const href = await page.evaluate(
    () => document.querySelector('link[rel~="icon"]')?.getAttribute('href') ?? null,
  );
  assert(href, 'no <link rel="icon"> in the document');
  assert(href.includes('/assets/icons/'), `icon is not the downloaded one: ${href}`);
  const res = await page.request.get(new URL(href, BASE).href);
  assert(res.status() === 200, `icon returned HTTP ${res.status()}`);
  return href;
});

await check('home: ingredients render as stacked display rows', async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const rows = page.locator('.t-ingredient');
  const count = await rows.count();
  assert(count >= 5, `expected at least 5 ingredient rows, found ${count}`);
  // Measured on the source at 390/768/1440: 46, 50 and 56, the same stepped
  // ramp as t-display-l. This ran as a >= 36 floor, which a fluid scale passed
  // at every width while rendering 36 on a phone against the source's 46.
  const size = await rows.first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  assert(size === 56, `ingredient rows render at ${size}px at 1440, expected 56`);
  await page.setViewportSize({ width: 390, height: 844 });
  const phone = await rows.first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  await page.setViewportSize({ width: 1440, height: 900 });
  assert(phone === 46, `ingredient rows render at ${phone}px at 390, expected 46`);
  return `${count} rows at ${Math.round(size)}px, ${phone}px at 390`;
});

await check('offer: flavour picker and stock state respond', async (page) => {
  await page.goto(BASE + '/#product-offer', { waitUntil: 'domcontentloaded' });
  const second = page.getByRole('button', { name: 'Solar Mango' });
  await second.scrollIntoViewIfNeeded();
  assert((await second.getAttribute('aria-pressed')) === 'false', 'second flavour starts pressed');
  await second.click();
  await page.waitForTimeout(220);
  assert((await second.getAttribute('aria-pressed')) === 'true', 'flavour did not select');
  const cta = page.getByRole('button', { name: 'Out of Stock' });
  assert(await cta.isVisible(), 'out-of-stock state did not apply to the CTA');
  return 'flavour switches and drives stock state';
});

await check('pinned sequence: track advances horizontally and stays pinned', async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const section = page.locator('section[aria-label="How Solene fits your day"]');
  assert((await section.count()) === 1, 'pinned sequence section not found');

  const height = await section.evaluate((el) => el.getBoundingClientRect().height);

  const readTrack = () =>
    page.evaluate(() => {
      const el = document.querySelector('section[aria-label="How Solene fits your day"] .flex');
      const sticky = document.querySelector('section[aria-label="How Solene fits your day"] .sticky');
      return {
        x: new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
        stickyTop: Math.round(sticky.getBoundingClientRect().top),
        panels: el.children.length,
      };
    });

  const top = await section.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y + 50), top);
  await page.waitForTimeout(600);
  const a = await readTrack();

  await page.evaluate((y) => window.scrollTo(0, y + 1500), top);
  await page.waitForTimeout(600);
  const b = await readTrack();

  assert(a.panels >= 3, `expected at least 3 panels, found ${a.panels}`);
  // Assert the property measured off the source rather than restating the
  // component's own formula: the panel stays pinned across ~3300px of scroll
  // (measured 1000->4300 on the source, 1100->4300 here).
  const pinned = height - 900;
  assert(
    Math.abs(pinned - 3300) < 300,
    `pinned scroll range is ${Math.round(pinned)}px, expected ~3300px as measured on the source`,
  );
  // It starts one panel off the right edge and slides in over the section above.
  assert(a.x > 0, `track did not start off the right edge (translateX ${Math.round(a.x)})`);
  assert(b.x < a.x, `track did not advance horizontally (${a.x} -> ${b.x})`);
  assert(
    Math.abs(b.stickyTop - a.stickyTop) < 40,
    `panel did not stay pinned (${a.stickyTop} -> ${b.stickyTop})`,
  );
  return `${a.panels} panels, translateX ${Math.round(a.x)} -> ${Math.round(b.x)}, pinned at ${b.stickyTop}px`;
});

await check('cart: opens from the header and closes', async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const panel = page.locator('aside[aria-label="Your cart"]');
  assert((await panel.count()) === 1, 'cart panel not present in the document');

  const read = () =>
    panel.evaluate((el) => ({
      hidden: el.getAttribute('aria-hidden'),
      left: Math.round(el.getBoundingClientRect().left),
      text: el.textContent || '',
    }));

  const atRest = await read();
  assert(atRest.hidden === 'true', 'cart should start hidden');
  const viewport = page.viewportSize()?.width ?? 1440;
  assert(atRest.left >= viewport - 40, `cart should rest off-screen, left=${atRest.left}`);

  await page.getByRole('button', { name: 'Open cart' }).first().click();
  await page.waitForTimeout(600);
  const opened = await read();
  assert(opened.hidden === 'false', 'cart did not open');
  assert(opened.left < atRest.left, `cart did not slide in (${atRest.left} -> ${opened.left})`);
  assert(/empty/i.test(opened.text), 'cart does not show the empty state');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  assert((await read()).hidden === 'true', 'Escape did not close the cart');
  return `slides ${atRest.left} -> ${opened.left}, empty state shown`;
});

await check('entrance: header drops and first screen eases in on load', async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  // Sample immediately: the entrance should still be in flight.
  const early = await page.evaluate(() => {
    const header = document.querySelector('header');
    const first = document.querySelector('main .enter-rise');
    return {
      headerAnim: header ? getComputedStyle(header).animationName : null,
      firstAnim: first ? getComputedStyle(first).animationName : null,
      headerTop: header ? Math.round(header.getBoundingClientRect().top) : null,
    };
  });
  assert(early.headerAnim === 'enter-drop', `header animation is ${early.headerAnim}`);
  assert(early.firstAnim === 'enter-rise', `first screen animation is ${early.firstAnim}`);

  await page.waitForTimeout(1300);
  const settled = await page.evaluate(() => {
    const header = document.querySelector('header');
    const first = document.querySelector('main .enter-rise');
    return {
      headerTop: Math.round(header.getBoundingClientRect().top),
      opacity: first ? Number(getComputedStyle(first).opacity) : 1,
    };
  });
  assert(settled.headerTop === 0, `header settled at ${settled.headerTop}`);
  assert(settled.opacity === 1, `first screen settled at opacity ${settled.opacity}`);
  return 'header drops to 0, content settles at opacity 1';
});

await check('cart: add, adjust quantity and check out', async (page) => {
  await page.goto(BASE + '/merch/cap', { waitUntil: 'domcontentloaded' });
  const panel = page.locator('aside[aria-label="Your cart"]');

  await page.getByRole('button', { name: 'Buy Now' }).first().click();
  await page.waitForTimeout(600);
  assert(
    (await panel.evaluate((el) => el.getAttribute('aria-hidden'))) === 'false',
    'cart did not open on add',
  );
  const afterAdd = (await panel.textContent()) ?? '';
  assert(/Cap/.test(afterAdd), 'added product is not listed in the cart');
  assert(/Subtotal/.test(afterAdd), 'cart does not show a subtotal');

  // Increase the line quantity and confirm the subtotal follows.
  const readSubtotal = async () => {
    const text = (await panel.textContent()) ?? '';
    const m = text.match(/Subtotal\s*\$([0-9.]+)/);
    return m ? Number(m[1]) : NaN;
  };
  const before = await readSubtotal();
  await panel.getByRole('button', { name: /Increase/ }).first().click();
  await page.waitForTimeout(350);
  const after = await readSubtotal();
  assert(after > before, `subtotal did not rise (${before} -> ${after})`);

  await panel.getByRole('button', { name: 'Checkout' }).click();
  await page.waitForTimeout(450);
  const done = (await panel.textContent()) ?? '';
  assert(/Order placed/.test(done), 'checkout did not complete');
  return `added, subtotal ${before} -> ${after}, checkout completes`;
});

await check('404: unknown route returns not-found', async (page) => {
  const res = await page.goto(BASE + '/merch/does-not-exist', { waitUntil: 'domcontentloaded' });
  assert(res.status() === 404, `expected 404, got ${res.status()}`);
  return '404 served';
});

await browser.close();

report.failures = failures;
report.passed = failures.length === 0;
writeFileSync(join(OUT, 'verify-report.json'), JSON.stringify(report, null, 2));

console.log(`\n${failures.length === 0 ? 'PASS' : 'FAIL'} — ${Object.keys(report.routes).length} route loads, ${Object.keys(report.interactions).length} interaction checks`);
if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
