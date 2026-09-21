import { chromium } from 'playwright';
/** Is the panel scrim a fixed height or a share of the panel? Our .panel-scrim
 *  uses 92.6%, which is 739/798 -- the ratio at a 900-tall viewport only. */
const b = await chromium.launch();
for (const h of [800, 900, 1000, 1100]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: h } })).newPage();
  await p.goto('https://solene.framer.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let v = 0; v < 9000; v += 400) { window.scrollTo(0, v); await new Promise(r => setTimeout(r, 45)); } });
  await p.evaluate((v) => window.scrollTo(0, v), 4200);
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => {
    const img = [...document.querySelectorAll('img')].find(i => i.currentSrc.includes('ucdAClc5'));
    let panel = img.parentElement;
    for (let i = 0; i < 3 && panel.parentElement; i++) panel = panel.parentElement;
    const grad = [...panel.querySelectorAll('*')].find(n => getComputedStyle(n).backgroundImage.includes('gradient'));
    const pr = img.getBoundingClientRect(), gr = grad.getBoundingClientRect();
    return { panel: Math.round(pr.height), scrim: Math.round(gr.height) };
  });
  console.log(`viewport ${h}  panel ${String(r.panel).padStart(4)}  scrim ${String(r.scrim).padStart(4)}  = ${(r.scrim / r.panel * 100).toFixed(1)}%`);
  await p.context().close();
}
await b.close();
