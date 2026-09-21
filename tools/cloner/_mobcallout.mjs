import { chromium } from 'playwright';
/** Are the SOL-G7 nutrient callouts rendered on a phone, and where? */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2600);
  for (let pass = 0; pass < 2; pass++) {
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
    await p.waitForTimeout(700);
  }
  console.log(`=== ${tag} ===`, await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    return ['B Vitamins', 'Magnesium', 'Vitamin D'].map((k) => {
      const els = [...document.querySelectorAll('*')]
        .filter(x => [...x.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().toLowerCase() === k.toLowerCase()))
        .filter(x => !x.closest('footer'));
      if (!els.length) return `${k}: absent`;
      const e = els[0]; const r = e.getBoundingClientRect(); const s = getComputedStyle(e);
      return `${k}: docY ${Math.round(docTop(e))} ${Math.round(r.width)}x${Math.round(r.height)} pos=${getComputedStyle(e.parentElement).position} vis=${s.visibility}/${s.display}`;
    }).join('\n   ');
  }));
  await p.context().close();
}
await b.close();
