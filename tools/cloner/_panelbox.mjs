import { chromium } from 'playwright';
/** The pinned panel's box and radius relative to its sticky viewport. */
const b = await chromium.launch();
for (const [base, tag, pat] of [
  ['https://solene.framer.ai', 'SOURCE', 'HmBptSSqZF2BuLVPrA1rifChmQ'],
  [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ', 'ynjap27ce8p5ymgbOTb5sMmKMGQ|HmBptSSqZF2BuLVPrA1rifChmQ'],
]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(600);
  const out = await p.evaluate((pat) => {
    const re = new RegExp(pat);
    const img = [...document.querySelectorAll('img')]
      .filter(i => re.test(decodeURIComponent(i.currentSrc || i.src || '')) && i.getBoundingClientRect().width > 300)[0];
    if (!img) return ['panel image not found'];
    const sticky = img.closest('*') && (() => { let n = img; while (n && getComputedStyle(n).position !== 'sticky') n = n.parentElement; return n; })();
    const sr = sticky ? sticky.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
    const lines = [`sticky ${Math.round(sr.width)}x${Math.round(sr.height)} pad=${sticky ? getComputedStyle(sticky).padding : '-'}`];
    let n = img;
    for (let i = 0; i < 6 && n && n !== sticky; i++) {
      const s = getComputedStyle(n); const r = n.getBoundingClientRect();
      lines.push(`  <${n.tagName}> [${Math.round(r.left - sr.left)},${Math.round(r.top - sr.top)},${Math.round(r.width)},${Math.round(r.height)}] rad=${s.borderRadius} ovf=${s.overflow} ofit=${s.objectFit}`);
      n = n.parentElement;
    }
    return lines;
  }, pat);
  console.log('=== ' + tag + ' ==='); out.forEach(o => console.log('  ' + o));
  await p.context().close();
}
await b.close();
