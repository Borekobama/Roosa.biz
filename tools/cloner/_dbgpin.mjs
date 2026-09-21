import { chromium } from 'playwright';
/** Where the pinned panel's feature label actually sits on the clone, per
 *  scroll offset — a capture probe reported "never flush" and needs checking. */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto(process.env.CLONE_BASE ?? 'http://localhost:3111/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(2000);
for (let y = 1200; y < 6000; y += 300) {
  await p.evaluate(v => window.scrollTo(0, v), y);
  await p.waitForTimeout(60);
  console.log(y, await p.evaluate(() => {
    const e = [...document.querySelectorAll('*')].find(x => x.children.length === 0 && (x.textContent || '').trim() === 'Suitable for everyone');
    if (!e) return 'no element';
    const r = e.getBoundingClientRect();
    return `${e.tagName} l=${Math.round(r.left)} t=${Math.round(r.top)} w=${Math.round(r.width)} h=${Math.round(r.height)}`;
  }));
}
await b.close();
