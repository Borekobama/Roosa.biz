import { chromium } from 'playwright';
const b = await chromium.launch();
const shots=[];
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const ctx = await b.newContext({viewport:{width:1440,height:900}});
  const p = await ctx.newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2500);
  // step to the panel showing the given label
  const want = process.argv[2] ?? 'Suitable for everyone';
  let found=false;
  for (let y=0; y<13000; y+=300) {
    await p.evaluate(v=>window.scrollTo(0,v), y);
    await p.waitForTimeout(620);
    const vis = await p.evaluate((w)=>{
      const es=[...document.querySelectorAll('*')].filter(x=>x.children.length===0&&(x.textContent||'').includes(w));
      return es.some(e=>{const r=e.getBoundingClientRect();
        return r.width>0 && r.left>=0 && r.right<=1440 && r.top>0 && r.bottom<900;});
    }, want);
    if (vis) { found=true; break; }
  }
  await p.waitForTimeout(900);
  shots.push(await p.screenshot());
  console.log(label, found?'ok':'NOT VISIBLE');
  await ctx.close();
}
const ctx = await b.newContext({viewport:{width:1480,height:520}});
const p = await ctx.newPage();
await p.setContent(`<body style="margin:0;background:#111;font:11px -apple-system;color:#fff">
 <div style="display:flex;gap:8px;padding:4px 8px"><div style="flex:1">SOURCE</div><div style="flex:1">CLONE</div></div>
 <div style="display:flex;gap:8px;padding:0 8px 8px">
 <img src="data:image/png;base64,${shots[0].toString('base64')}" style="width:728px;outline:1px solid #0f0">
 <img src="data:image/png;base64,${shots[1].toString('base64')}" style="width:728px;outline:1px solid #f60"></div></body>`);
await p.waitForTimeout(250);
await p.screenshot({ path: process.argv[3] ?? '/private/tmp/claude-501/-Users-berke-Downloads-Projects-Website-templates-solene/d6b12b59-de9c-4fd6-a5e3-91c44e642cb3/scratchpad/panel.png', fullPage:true });
await b.close();
