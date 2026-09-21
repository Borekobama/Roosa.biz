import { chromium } from 'playwright';
const [srcRoute, clnRoute, y, out] = [process.argv[2], process.argv[3], Number(process.argv[4]||0), process.argv[5]];
const b = await chromium.launch();
const shots=[];
for (const [base,route] of [['https://solene.framer.ai',srcRoute],[process.env.CLONE_BASE??'http://localhost:3111',clnRoute]]) {
  const ctx = await b.newContext({viewport:{width:1440,height:900}});
  const p = await ctx.newPage();
  await p.goto(base+route, { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2600);
  if (y) { await p.evaluate(v=>window.scrollTo(0,v), y); await p.waitForTimeout(800); }
  shots.push(await p.screenshot());
  await ctx.close();
}
const ctx = await b.newContext({viewport:{width:1480,height:520}});
const p = await ctx.newPage();
await p.setContent(`<body style="margin:0;background:#111;font:11px -apple-system;color:#fff">
 <div style="display:flex;gap:8px;padding:4px 8px"><div style="flex:1">SOURCE ${srcRoute} @${y}</div><div style="flex:1">CLONE ${clnRoute} @${y}</div></div>
 <div style="display:flex;gap:8px;padding:0 8px 8px">
 <img src="data:image/png;base64,${shots[0].toString('base64')}" style="width:728px;outline:1px solid #0f0">
 <img src="data:image/png;base64,${shots[1].toString('base64')}" style="width:728px;outline:1px solid #f60"></div></body>`);
await p.waitForTimeout(250);
await p.screenshot({ path: out, fullPage:true });
await b.close();
