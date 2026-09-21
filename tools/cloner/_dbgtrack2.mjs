import { chromium } from 'playwright';
/**
 * Trace the pinned track's own transform across a scroll jump.
 *
 * Two traps this avoids. The page carries several inline translate3d nodes, so
 * the track is found by the panel image it holds rather than by being first.
 * And the track holds still through its dwell (progress .403-.597, roughly
 * scrollY 2318 to 2970) — a jump spanning that measures the hold, not the
 * spring, and produces a flat stretch that looks like a stalled animation.
 * Default to a pair inside the first leg.
 */
const FROM = Number(process.env.FROM ?? 1200);
const TO = Number(process.env.TO ?? 1600);
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto((process.env.CLONE_BASE ?? 'http://localhost:3111') + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(2200);
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
await p.evaluate((v) => window.scrollTo(0, v), FROM);
await p.waitForTimeout(1600);
console.log(await p.evaluate(async ({ FROM, TO }) => {
  const tracks = [...document.querySelectorAll('div')].filter(d => (d.style.transform || '').includes('translate3d'));
  const t = tracks.find(d => d.querySelector('img') && d.children.length >= 3);
  if (!t) return `no pinned track among ${tracks.length}`;
  const read = () => parseFloat(t.style.transform.match(/translate3d\((-?[\d.]+)/)?.[1] ?? '0');
  const out = [`jump ${FROM} -> ${TO}  start ${read().toFixed(1)}%`];
  const samples = [];
  const t0 = performance.now();
  window.scrollTo(0, TO);
  await new Promise((res) => {
    const step = () => {
      const el = performance.now() - t0;
      samples.push([Math.round(el), read()]);
      if (el < 900) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
  const from = samples[0][1], to = samples[samples.length - 1][1];
  out.push(`from ${from.toFixed(1)} to ${to.toFixed(1)}`);
  out.push([50, 100, 200, 350, 550, 800].map((ms) => {
    const s = samples.reduce((a, c) => (Math.abs(c[0] - ms) < Math.abs(a[0] - ms) ? c : a));
    return `${ms}ms:${(((s[1] - from) / (to - from || 1)) * 100).toFixed(0)}%`;
  }).join('  '));
  return out.join('\n');
}, { FROM, TO }));
await b.close();
