import { chromium } from 'playwright';
/** Click each flavour on the offer panel and read the CTA that results, so the
 *  stock state is observed per flavour rather than inferred from one load. */
const route = process.argv[2] ?? '/';
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(500);
  console.log('=== ' + tag + ' ' + route + ' ===');
  const cta = () => p.evaluate(() => {
    const el = [...document.querySelectorAll('a,button')].find(e => {
      const r = e.getBoundingClientRect();
      return r.width > 380 && r.height > 30 && r.height < 70 && parseFloat(getComputedStyle(e).borderRadius) > 15;
    });
    if (!el) return 'no CTA';
    const s = getComputedStyle(el); const r = el.getBoundingClientRect();
    return `"${el.textContent.trim()}" ${Math.round(r.width)}x${Math.round(r.height)} bg=${s.backgroundColor} col=${s.color} disabled=${el.disabled ?? 'n/a'}`;
  });
  console.log('  on load:        ' + await cta());
  for (const name of ['Green Apple', 'Solar Mango']) {
    const ok = await p.evaluate((n) => {
      const el = [...document.querySelectorAll('a,button')].find(e => e.textContent.trim() === n);
      if (!el) return false; el.click(); return true;
    }, name);
    await p.waitForTimeout(700);
    console.log(`  ${name.padEnd(14)}: ` + (ok ? await cta() : 'pill not found'));
  }
  await p.context().close();
}
await b.close();
