import { chromium } from 'playwright';
/** Fine-grained track travel: the routine panel's x against scrollY, so the
 *  lead-in, the dwell and the lead-out can be read off rather than assumed. */
const b = await chromium.launch();
for (const [base, tag, pat] of [
  ['https://solene.framer.ai', 'SOURCE', 'HmBptSSqZF2BuLVPrA1rifChmQ'],
  [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ', 'ynjap27ce8p5ymgbOTb5sMmKMGQ|HmBptSSqZF2BuLVPrA1rifChmQ'],
]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.waitForTimeout(500);
  const rows = [];
  for (let y = 800; y <= 5600; y += 100) {
    await p.evaluate(v => window.scrollTo(0, v), y);
    await p.waitForTimeout(Number(process.env.SETTLE ?? 90));
    const x = await p.evaluate((pat) => {
      const re = new RegExp(pat);
      const img = [...document.querySelectorAll('img')]
        .filter(i => re.test(decodeURIComponent(i.currentSrc || i.src || '')) && i.getBoundingClientRect().width > 300)[0];
      return img ? Math.round(img.getBoundingClientRect().x) : null;
    }, pat);
    rows.push([y, x]);
  }
  const shown = rows.filter(r => r[1] !== null);
  console.log('=== ' + tag + ` === samples ${shown.length}/${rows.length}`);
  if (shown.length) {
    console.log('  visible y=' + shown[0][0] + '..' + shown[shown.length - 1][0] +
      '  first move at y=' + (shown.find(r => r[1] < shown[0][1] - 4)?.[0] ?? '-') +
      '  flush (|x|<6) y=' + (shown.find(r => Math.abs(r[1]) < 6)?.[0] ?? '-') +
      '..' + ([...shown].reverse().find(r => Math.abs(r[1]) < 6)?.[0] ?? '-'));
    console.log('  ' + shown.map(([y, x]) => `${y}:${x}`).join(' '));
  } else {
    console.log('  no samples — selector matched nothing');
  }
  await p.context().close();
}
await b.close();
