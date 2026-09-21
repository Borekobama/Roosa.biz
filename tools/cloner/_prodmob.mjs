import { chromium } from 'playwright';
/** The product detail block at phone, both sides, in document order. */
const b = await chromium.launch();
const routes = { SOURCE: '/merch/daily-multivitamin%E2%84%A2', 'CLONE ': '/merch/daily-multivitamin' };
for (const [tag, route] of Object.entries(routes)) {
  const base = tag === 'SOURCE' ? 'https://solene.framer.ai' : (process.env.CLONE_BASE ?? 'http://localhost:3111');
  const p = await (await b.newContext({ viewport: { width: Number(process.env.VW ?? 390), height: 844 }, isMobile: true, hasTouch: true })).newPage();
  await p.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async () => { for (let y = 0; y < 6000; y += 320) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(600);
  const out = await p.evaluate(() => {
    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const rows = [];
    for (const el of document.querySelectorAll('h1,h2,h3,h4,h5,p,img,button,a,li')) {
      const y = docTop(el), h = el.offsetHeight, w = el.offsetWidth;
      if (h < 14 || w < 14 || y > 1700) continue;
      const leaf = !el.children.length || ![...el.children].some(c => c.offsetHeight > 4);
      if (!leaf && el.tagName !== 'IMG') continue;
      const s = getComputedStyle(el);
      const t = el.tagName === 'IMG' ? `IMG ${w}x${h}` : `${el.tagName} ${parseFloat(s.fontSize)}px "${(el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30)}"`;
      rows.push(`  ${String(Math.round(y)).padStart(5)} h=${String(h).padStart(3)} w=${String(w).padStart(3)}  ${t}`);
    }
    return rows.slice(0, 18);
  });
  console.log(`=== ${tag} ===`);
  out.forEach(r => console.log(r));
  await p.context().close();
}
await b.close();
