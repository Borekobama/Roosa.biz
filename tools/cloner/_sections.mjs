import { chromium } from 'playwright';
/** Every band of the page in document order: top and height of each top-level
 *  block under main, so drift can be attributed to a section rather than
 *  guessed from one heading's position. */
const route = process.argv[2] ?? '/';
const b = await chromium.launch();
const res = {};
for (const [base, tag] of [['https://solene.framer.ai', 'src'], [process.env.CLONE_BASE ?? 'http://localhost:3111', 'cln']]) {
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)); } });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(800);
  res[tag] = await p.evaluate(() => {
    const main = document.querySelector('main') ?? document.body;
    // descend through single-child wrappers to the row of real bands
    let host = main;
    while (host.children.length === 1) host = host.children[0];
    return [...host.children].map(el => {
      const r = el.getBoundingClientRect();
      const label = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 34) || `<${el.tagName}>`;
      return { top: Math.round(r.top + scrollY), h: Math.round(r.height), label };
    }).filter(x => x.h > 4);
  });
  await p.context().close();
}
const n = Math.max(res.src.length, res.cln.length);
console.log(`bands: source ${res.src.length}, clone ${res.cln.length}`);
console.log('#   src top  src h  | cln top  cln h  | dTop  dH  label');
for (let i = 0; i < n; i++) {
  const s = res.src[i], c = res.cln[i];
  const f = (v) => String(v ?? '-').padStart(7);
  console.log(
    String(i).padEnd(3),
    f(s?.top), f(s?.h), '|', f(c?.top), f(c?.h), '|',
    f(s && c ? c.top - s.top : '-'), f(s && c ? c.h - s.h : '-'),
    (s?.label ?? '').slice(0, 30) + '  ||  ' + (c?.label ?? '').slice(0, 30));
}
await b.close();
