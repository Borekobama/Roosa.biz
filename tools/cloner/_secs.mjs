import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil:'domcontentloaded', timeout:90000 });
await p.waitForTimeout(2500);
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}});
await p.evaluate(()=>window.scrollTo(0,0));
await p.waitForTimeout(900);
const r = await p.evaluate(()=>{
  const out=[];
  for (const e of document.querySelectorAll('h1,h2,h3,h4,h5,p,div,span')) {
    const t=(e.innerText||'').replace(/\s+/g,' ').trim();
    if (!/One formula|elevates your everyday/i.test(t)) continue;
    if (t.length>160) continue;
    const r=e.getBoundingClientRect(); const c=getComputedStyle(e);
    out.push(`<${e.tagName}> docY=${Math.round(r.y+scrollY)} x=${Math.round(r.x)} ${Math.round(r.width)}x${Math.round(r.height)} fs=${c.fontSize} lh=${c.lineHeight} ls=${c.letterSpacing} color=${c.color} align=${c.textAlign} txt="${t.slice(0,90)}"`);
  }
  return [...new Set(out)];
});
r.forEach(x=>console.log(x));
await b.close();
