import { chromium } from 'playwright';
import fs from 'node:fs';
/** Plain screenshot of a route at a given scroll offset, both sides. */
const route = process.argv[2] ?? '/';
const y = Number(process.argv[3] ?? 0);
const dir = 'docs/research/_compare/shot';
fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch();
for (const [base, tag] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
  await p.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let k = 0; k < document.body.scrollHeight; k += 400) { window.scrollTo(0, k); await new Promise(r => setTimeout(r, 60)); } });
  await p.evaluate(v => window.scrollTo(0, v), y);
  await p.waitForTimeout(900);
  fs.writeFileSync(`${dir}/${tag}.png`, await p.screenshot());
  await p.context().close();
}
await b.close();
console.log('wrote', dir);
