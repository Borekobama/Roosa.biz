import { chromium } from 'playwright';
const b = await chromium.launch();
const shots=[];
for (const [base] of [['https://solene.framer.ai'],[process.env.CLONE_BASE??'http://localhost:3111']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(3000);
  shots.push(await p.screenshot({ clip:{x:990,y:4,width:440,height:62} }));
  await p.context().close();
}
const ctx = await b.newContext({viewport:{width:940,height:300}});
const p = await ctx.newPage();
await p.setContent(`<body style="margin:0;background:#111;font:12px -apple-system;color:#fff;padding:8px">
 <div>SOURCE</div><img src="data:image/png;base64,${shots[0].toString('base64')}" style="width:880px;image-rendering:pixelated">
 <div style="margin-top:10px">CLONE</div><img src="data:image/png;base64,${shots[1].toString('base64')}" style="width:880px;image-rendering:pixelated">
</body>`);
await p.waitForTimeout(250);
await p.screenshot({ path: process.argv[2], fullPage:true });
await b.close();
