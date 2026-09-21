import { chromium } from 'playwright';
/** What the offer panel's picture becomes when each flavour is picked. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(500);
  const read = () => p.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')]
      .map(i => ({ i, r: i.getBoundingClientRect() }))
      .filter(o => Math.abs(o.r.width - 656) < 40 && Math.abs(o.r.height - 656) < 40);
    return imgs.map(o => decodeURIComponent(o.i.currentSrc || '').split('/').pop().replace(/[?&].*$/, '').slice(0, 30)
      + ` ${Math.round(o.r.width)}x${Math.round(o.r.height)} vis=${getComputedStyle(o.i).opacity}`).join(' | ') || 'none';
  });
  console.log('=== ' + tag + ' ===');
  console.log('  on load:      ' + await read());
  for (const name of ['Green Apple', 'Solar Mango']) {
    const ok = await p.evaluate((n) => {
      const el = [...document.querySelectorAll('a,button')].find(e => e.textContent.trim() === n);
      if (!el) return false; el.click(); return true;
    }, name);
    await p.waitForTimeout(900);
    console.log(`  ${name.padEnd(12)}: ` + (ok ? await read() : 'pill not found'));
  }
  await p.context().close();
}
await b.close();
