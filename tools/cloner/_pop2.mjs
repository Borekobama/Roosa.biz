import { chromium } from 'playwright';
const CLN = process.env.CLONE_BASE ?? 'http://localhost:3111';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();

const pick = () => p.evaluate(() => {
  const h = [...document.querySelectorAll('h1')]
    .filter((e) => /Daily well-being requires real/i.test(e.textContent || ''))
    .sort((a, z) => z.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];
  if (!h) return null;
  let n = h;
  for (let i = 0; i < 6 && n; i++) {
    const c = getComputedStyle(n);
    const sc = c.scale && c.scale !== 'none' ? 'scale:' + c.scale : null;
    if (c.opacity !== '1' || c.transform !== 'none' || sc)
      return `op=${Number(c.opacity).toFixed(2)} ${sc ?? c.transform.slice(0, 28)}`;
    n = n.parentElement;
  }
  return 'op=1.00 settled';
});

await p.goto(CLN + '/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1600);
const target = await p.evaluate(() => {
  const h = [...document.querySelectorAll('h1')]
    .filter((e) => /Daily well-being requires real/i.test(e.textContent || ''))
    .map((e) => Math.round(e.getBoundingClientRect().top + window.scrollY))
    .sort((a, z) => z - a)[0];
  return h ?? null;
});
const read = async (off) => {
  await p.evaluate((v) => window.scrollTo(0, Math.max(0, v)), target - off);
  await p.waitForTimeout(560);
  return pick();
};
console.log('CLOSING BLOCK  far:', await read(1300), '| entering:', await read(760), '| in view:', await read(300));

// merch purchase on a product that is actually for sale
await p.goto(CLN + '/merch/t-shirt', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1400);
const price = await p.evaluate(() =>
  [...document.querySelectorAll('*')].filter((e) => e.children.length === 0 && /^\$\d/.test(e.textContent.trim()))[0]?.textContent.trim());
await p.getByRole('button', { name: 'M', exact: true }).click();
await p.waitForTimeout(400);
await p.getByRole('button', { name: 'Buy Now' }).first().click();
await p.waitForTimeout(800);
const cart = () => p.evaluate(() => (document.querySelector('aside[aria-label="Your cart"]')?.innerText || '').replace(/\s+/g, ' ').slice(0, 72));
console.log('T-SHIRT', price);
console.log('  in cart :', await cart());
await p.locator('aside[aria-label="Your cart"] button[aria-label^="Increase"]').first().click();
await p.waitForTimeout(500);
console.log('  qty bump:', await cart());
await p.getByRole('button', { name: /Checkout/i }).first().click();
await p.waitForTimeout(900);
console.log('  checkout:', await cart());
await b.close();
