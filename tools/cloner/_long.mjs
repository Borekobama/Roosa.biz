import { chromium } from 'playwright';
const b = await chromium.launch();
const run = async (base, route, label, rate) => {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  await p.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(3000);
  const res = await p.evaluate(async () => {
    const long = [];
    const po = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) long.push(Math.round(e.duration));
    });
    try { po.observe({ entryTypes: ['longtask'] }); } catch {}
    const t0 = performance.now();
    for (let y = 0; y < document.documentElement.scrollHeight; y += 200) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 16));
    }
    const elapsed = performance.now() - t0;
    po.disconnect();
    return { longTasks: long.length, worstTask: Math.max(0, ...long), elapsed: Math.round(elapsed) };
  });
  await ctx.close();
  console.log(`${label} ${route} @${rate}x`, JSON.stringify(res));
};
for (const r of ['/', '/science']) {
  await run('https://solene.framer.ai', r, 'SOURCE', 6);
  await run('http://localhost:3111', r, 'CLONE ', 6);
}
await b.close();
