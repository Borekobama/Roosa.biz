#!/usr/bin/env node
/**
 * Interactive-state capture: source vs clone, side by side.
 *
 * The route sweep only covers scroll positions. This drives the states the
 * review calls out — menu open, panels open, hover, variant selection — and
 * composites each pair for comparison.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE = 'https://solene.framer.ai';
const CLONE = process.env.CLONE_BASE ?? 'http://localhost:3111';
const OUT = join(process.cwd(), 'docs', 'research', '_states');
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function pair(name, width, height, srcRoute, cloneRoute, drive) {
  const shots = [];
  for (const [base, route, label] of [
    [SOURCE, srcRoute, 'source'],
    [CLONE, cloneRoute, 'clone'],
  ]) {
    const ctx = await browser.newContext({ viewport: { width, height } });
    const page = await ctx.newPage();
    try {
      await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForTimeout(2200);
      await drive(page, label);
      await page.waitForTimeout(600);
      shots.push(await page.screenshot());
    } catch (error) {
      console.error(`  ! ${name} ${label}: ${String(error.message).split('\n')[0]}`);
      shots.push(await page.screenshot().catch(() => null));
    } finally {
      await ctx.close();
    }
  }
  if (!shots[0] || !shots[1]) return;

  const ctx = await browser.newContext({
    viewport: { width: width * 2 + 36, height: height + 46 },
  });
  const page = await ctx.newPage();
  await page.setContent(`<body style="margin:0;background:#111;font:12px -apple-system;color:#fff">
    <div style="display:flex;gap:12px;padding:6px 12px"><div style="flex:1">SOURCE — ${name}</div><div style="flex:1">CLONE — ${name}</div></div>
    <div style="display:flex;gap:12px;padding:0 12px 12px">
      <img src="data:image/png;base64,${shots[0].toString('base64')}" style="width:${width}px;outline:1px solid #0f0">
      <img src="data:image/png;base64,${shots[1].toString('base64')}" style="width:${width}px;outline:1px solid #f60">
    </div></body>`);
  await page.waitForTimeout(250);
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true });
  await ctx.close();
  console.log(`✔ ${name}`);
}

// Settle whether the source carries the "Small habits" panel.
await pair('small-habits', 1440, 900, '/', '/', async (page) => {
  await page.evaluate(async () => {
    for (let y = 0; y <= 1351; y += 150) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
  });
});

await pair('menu-open', 390, 844, '/', '/', async (page, label) => {
  if (label === 'clone') {
    await page.getByRole('button', { name: 'Open menu' }).click({ timeout: 8000 }).catch(() => {});
    return;
  }
  // A synthetic event does not open it; click the control's measured position.
  // At 390px the cart sits at x=286 (40x40) with the menu control to its right.
  await page.mouse.click(352, 35);
  await page.waitForTimeout(1100);
});

await pair('faq-open', 1440, 900, '/', '/', async (page, label) => {
  if (label === 'clone') {
    const t = page.locator('[id^="faq-trigger-"]').first();
    await t.scrollIntoViewIfNeeded();
    await t.click();
  } else {
    await page.evaluate(() => {
      const h = [...document.querySelectorAll('h5')].find((e) => /take Solene daily/i.test(e.textContent || ''));
      h?.scrollIntoView({ block: 'center' });
      (h?.closest('div')?.querySelector('div') ?? h)?.dispatchEvent(
        new MouseEvent('click', { bubbles: true }),
      );
    });
  }
});

await pair('product-variants', 1440, 900, '/merch/daily-multivitamin%E2%84%A2', '/merch/daily-multivitamin', async (page) => {
  await page.getByRole('button', { name: /Solar Mango/i }).first().click({ timeout: 8000 }).catch(() => {});
});

// Blog card hover: the source zooms the image under the cursor.
await pair('blog-hover', 1440, 900, '/blog', '/blog', async (page) => {
  await page.evaluate(() => window.scrollTo(0, 420));
  await page.waitForTimeout(400);
  const card = page.locator('main a[href*="/blog/"]').first();
  await card.hover({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(700);
});

// Product thumbnails sit under the image on both sides.
await pair('product-thumbs', 1440, 900, '/merch/cap', '/merch/cap', async (page) => {
  await page.evaluate(() => window.scrollTo(0, 620));
});

// Size selection on apparel.
await pair('merch-sizes', 1440, 900, '/merch/t-shirt', '/merch/t-shirt', async (page, label) => {
  if (label === 'clone') {
    await page.getByRole('button', { name: 'M', exact: true }).click({ timeout: 6000 }).catch(() => {});
  }
  await page.evaluate(() => window.scrollTo(0, 300));
});

// Buy Offer scrolls to the product block.
await pair('buy-offer', 1440, 900, '/', '/', async (page) => {
  await page.locator('header a[href*="product-offer"], header a[href*="#"]').first()
    .click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1400);
});

// Cart holding a line, against the source's own cart panel.
await pair('cart-filled', 1440, 900, '/merch/cap', '/merch/cap', async (page, label) => {
  if (label === 'clone') {
    await page.getByRole('button', { name: 'Buy Now' }).first().click({ timeout: 8000 }).catch(() => {});
  } else {
    await page.locator('header button').last().click({ timeout: 8000 }).catch(() => {});
  }
  await page.waitForTimeout(900);
});

// First paint after reload, while the entrance is still running.
await pair('reload', 1440, 900, '/', '/', async (page) => {
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(160);
});

// The carousel image panel: proportions, green hue and the sub-labels.
await pair('carousel-panel', 1440, 900, '/', '/', async (page) => {
  await page.evaluate(async () => {
    for (let y = 0; y <= 2600; y += 200) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
  });
});

// SOL-G7 panel: the milk-glass treatment over the product.
await pair('solg7-glass', 1440, 900, '/', '/', async (page) => {
  await page.evaluate(async () => {
    const target = [...document.querySelectorAll('h1,h2,h3')]
      .find((h) => /SOL-G7/i.test(h.textContent || ''));
    const y = target ? target.getBoundingClientRect().top + window.scrollY - 160 : 6500;
    for (let n = 0; n <= y; n += 250) {
      window.scrollTo(0, n);
      await new Promise((r) => setTimeout(r, 55));
    }
    window.scrollTo(0, y);
  });
  await page.waitForTimeout(900);
});

/** Scroll to a section by its heading, so both sides align regardless of length. */
const toHeading = (pattern) => async (page) => {
  await page.evaluate(async (src) => {
    const re = new RegExp(src, 'i');
    const target = [...document.querySelectorAll('h1,h2,h3,h4')]
      .find((h) => re.test(h.textContent || ''));
    const y = target ? target.getBoundingClientRect().top + window.scrollY - 140 : 0;
    for (let n = 0; n <= y; n += 260) {
      window.scrollTo(0, n);
      await new Promise((r) => setTimeout(r, 55));
    }
    window.scrollTo(0, y);
  }, pattern);
  await page.waitForTimeout(900);
};

await pair('regenerative-news', 1440, 900, '/', '/', toHeading('regenerative news'));
await pair('reviews', 1440, 900, '/', '/', toHeading("listen just from us"));
await pair('ingredient-rows', 1440, 900, '/', '/', toHeading('^probiotics$'));
await pair('science-compare', 1440, 900, '/science', '/science', toHeading('outperforms other gummies'));
await pair('science-nutrition', 1440, 900, '/science', '/science', toHeading('Inside each'));

await browser.close();
console.log(`\npairs in docs/research/_states`);
