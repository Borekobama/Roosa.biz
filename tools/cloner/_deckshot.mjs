import { chromium } from 'playwright';
/** Screenshot the phone deck at each pin position, on whichever side is asked
 *  for, so the two can be put beside each other. */
const OUT = process.env.OUT ?? '/tmp/deck';
const BASE = process.env.BASE ?? 'https://solene.framer.ai';
const TAG = process.env.TAG ?? 'src';
const STOPS = (process.env.STOPS ?? '1300,2200,2900').split(',').map(Number);
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage();
await p.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForTimeout(2600);
await p.evaluate(async () => { for (let y = 0; y < 9000; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } window.scrollTo(0, 0); });
await p.waitForTimeout(1200);
for (const [i, y] of STOPS.entries()) {
  await p.evaluate((v) => window.scrollTo(0, v), y);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/${TAG}-${i + 1}-${y}.png` });
  console.log(`${TAG} @ ${y}`);
}
await b.close();
