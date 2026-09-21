import { chromium } from 'playwright';
const b = await chromium.launch();
const run = async (base, label) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const seen = [];
  p.on('response', async (r) => {
    const t = r.request().resourceType();
    if (t !== 'image') return;
    try {
      const len = Number(r.headers()['content-length'] ?? 0);
      seen.push({ bytes: len, url: new URL(r.url()).pathname.split('/').pop().slice(0, 30) });
    } catch {}
  });
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.evaluate(async () => {
    for (let y = 0; y < 6000; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 180)); }
  });
  await p.waitForTimeout(1500);
  const total = seen.reduce((a, s) => a + s.bytes, 0);
  const top = seen.sort((a, b) => b.bytes - a.bytes).slice(0, 5);
  console.log(`${label} images=${seen.length} total=${(total/1024/1024).toFixed(1)}MB`);
  for (const t of top) console.log(`   ${(t.bytes/1024).toFixed(0)}KB ${t.url}`);
  await p.close();
};
await run('https://solene.framer.ai', 'SOURCE');
await run('http://localhost:3111', 'CLONE ');
await b.close();
