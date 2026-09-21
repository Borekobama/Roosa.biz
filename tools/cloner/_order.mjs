import { chromium } from 'playwright';
const b = await chromium.launch();
const base = process.argv[2] ?? 'https://solene.framer.ai';
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
await p.waitForTimeout(2500);
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}});
const keys=['One formula','Small habits','Well-being that','Intelligent nutrition','elevates your everyday','Ingredients','Our latest regenerative','Frequently asked'];
const seen={};
for (let y=0; y<=12000; y+=150) {
  await p.evaluate(v=>window.scrollTo(0,v), y);
  await p.waitForTimeout(420);
  const vis = await p.evaluate((keys)=>{
    const r={};
    for (const k of keys) {
      const es=[...document.querySelectorAll('h1,h2,h3,h4,h5,p')].filter(e=>(e.innerText||'').includes(k));
      r[k]=es.some(e=>{const b=e.getBoundingClientRect();
        return b.width>0 && b.left>0 && b.right<1440 && b.top>-20 && b.bottom<920;});
    }
    return r;
  }, keys);
  for (const k of keys) if (vis[k] && seen[k]===undefined) seen[k]=y;
}
console.log(base);
Object.entries(seen).sort((a,b)=>a[1]-b[1]).forEach(([k,v])=>console.log(`  ${String(v).padStart(6)}  ${k}`));
await b.close();
