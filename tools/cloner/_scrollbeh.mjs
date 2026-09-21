import { chromium } from 'playwright';
/** Does scrollTo land instantly, or does the page animate it? */
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'SOURCE'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'CLONE ']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2200);
  await p.evaluate(() => window.scrollTo(0, 2000));
  await p.waitForTimeout(1200);
  console.log(tag, await p.evaluate(async () => {
    const beh = getComputedStyle(document.documentElement).scrollBehavior;
    const samples = [];
    const t0 = performance.now();
    window.scrollTo(0, 3000);
    await new Promise((res) => {
      const step = () => {
        const el = performance.now() - t0;
        samples.push(`${Math.round(el)}:${Math.round(window.scrollY)}`);
        if (el < 500) requestAnimationFrame(step); else res();
      };
      requestAnimationFrame(step);
    });
    return `scroll-behavior=${beh}  ` + samples.filter((_, i) => i % 4 === 0).join(' ');
  }));
  await p.context().close();
}
await b.close();
