import { chromium } from 'playwright';
const b = await chromium.launch();
const route = process.argv[2] ?? '/science';
const marker = process.argv[3];
const out = process.argv[4];
const shots=[];
for (const [base,label] of [['https://solene.framer.ai',"src"],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const ctx = await b.newContext({viewport:{width:1440,height:900}});
  const p = await ctx.newPage();
  await p.goto(base+route, { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55));}});
  await p.waitForTimeout(700);
  const y = await p.evaluate((m)=>{
    const e=[...document.querySelectorAll('h1,h2,h3,h4,h5,p,span,div')].filter(x=>x.children.length===0 && (x.textContent||'').toLowerCase().includes(m.toLowerCase()))[0];
    if(!e) return null; const r=e.getBoundingClientRect(); return Math.round(r.y+window.scrollY);
  }, marker);
  console.log(label, 'markerY', y);
  if (y!=null) { await p.evaluate(v=>window.scrollTo(0,Math.max(0,v-140)), y); await p.waitForTimeout(900); }
  shots.push(await p.screenshot());
  await ctx.close();
}
const ctx = await b.newContext({viewport:{width:1480,height:520}});
const p = await ctx.newPage();
await p.setContent(`<body style="margin:0;background:#111;font:11px -apple-system;color:#fff">
 <div style="display:flex;gap:8px;padding:4px 8px"><div style="flex:1">SOURCE ${marker}</div><div style="flex:1">CLONE ${marker}</div></div>
 <div style="display:flex;gap:8px;padding:0 8px 8px">
 <img src="data:image/png;base64,${shots[0].toString('base64')}" style="width:728px;outline:1px solid #0f0">
 <img src="data:image/png;base64,${shots[1].toString('base64')}" style="width:728px;outline:1px solid #f60"></div></body>`);
await p.waitForTimeout(250);
await p.screenshot({ path: out, fullPage:true });
await b.close();
