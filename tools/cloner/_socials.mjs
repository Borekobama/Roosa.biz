import { chromium } from 'playwright';
/** Does the source's footer carry social links at all? The paint-based probe
 *  skips links with no background and an inline SVG. */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(600);
  console.log('=== ' + tag + ' ===', await p.evaluate(() => {
    const f = document.querySelector('footer');
    if (!f) return 'no footer';
    const fr = f.getBoundingClientRect();
    const links = [...f.querySelectorAll('a')].map(a => {
      const r = a.getBoundingClientRect();
      return { href: a.getAttribute('href') || '', label: (a.textContent || '').trim().slice(0, 18), svg: a.querySelectorAll('svg').length, box: `${Math.round(r.left)},${Math.round(r.top - fr.top)},${Math.round(r.width)}x${Math.round(r.height)}` };
    });
    const ext = links.filter(l => /^https?:/.test(l.href) || l.svg > 0);
    return `\n  total links ${links.length}, with svg or external: ${ext.length}\n` +
      ext.map(l => `    ${l.box.padEnd(20)} svg=${l.svg} "${l.label}" ${l.href.slice(0, 40)}`).join('\n');
  }));
  await p.context().close();
}
await b.close();
