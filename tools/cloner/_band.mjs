import { chromium } from 'playwright';
const b = await chromium.launch();
const base = process.argv[2] ?? 'https://solene.framer.ai';
const ys = (process.argv[3] ?? '600,1000,1400,1800').split(',').map(Number);
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
await p.waitForTimeout(2500);
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}});
const shots=[];
for (const y of ys) { await p.evaluate(v=>window.scrollTo(0,v), y); await p.waitForTimeout(900); shots.push(await p.screenshot()); }
const ctx = await b.newContext({viewport:{width:1480,height:400}});
const q = await ctx.newPage();
await q.setContent(`<body style="margin:0;background:#111;font:11px -apple-system;color:#fff"><div style="display:flex;flex-wrap:wrap;gap:6px;padding:6px">
${shots.map((s,i)=>`<div><div>y=${ys[i]}</div><img src="data:image/png;base64,${s.toString('base64')}" style="width:360px;outline:1px solid #0f0"></div>`).join('')}
</div></body>`);
await q.waitForTimeout(250);
await q.screenshot({ path: process.argv[4] ?? '/private/tmp/claude-501/-Users-berke-Downloads-Projects-Website-templates-solene/d6b12b59-de9c-4fd6-a5e3-91c44e642cb3/scratchpad/band.png', fullPage:true });
await b.close();
