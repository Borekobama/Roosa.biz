import { chromium } from 'playwright';
const t = (label, ms) => console.log(`${label}: ${ms}ms`);
let s = Date.now();
const b = await chromium.launch();
t('launch', Date.now() - s);
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
s = Date.now();
await p.goto('http://localhost:3111/', { waitUntil: 'domcontentloaded', timeout: 30000 });
t('goto home (domcontentloaded)', Date.now() - s);
s = Date.now();
const seq = await p.locator('section[aria-label="How Solene fits your day"]').count();
t('locate sequence', Date.now() - s);
console.log('sequence count:', seq);
s = Date.now();
try {
  await p.getByRole('banner').getByRole('link', { name: 'Buy Offer' }).click({ timeout: 8000 });
  t('click Buy Offer', Date.now() - s);
} catch (e) { console.log('click failed:', String(e.message).split('\n')[0]); }
s = Date.now();
await p.goto('http://localhost:3111/merch', { waitUntil: 'domcontentloaded', timeout: 30000 });
t('goto merch', Date.now() - s);
await b.close();
console.log('DONE');
