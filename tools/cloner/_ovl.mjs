import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil:'domcontentloaded', timeout:90000 });
await p.waitForTimeout(2500);
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}});
await p.waitForTimeout(800);
const r = await p.evaluate(()=>{
  const img=[...document.querySelectorAll('img')].find(i=>/HmBptSSqZF2BuLVPrA1rifChmQ/.test(i.currentSrc||''));
  let panel=img; for(let i=0;i<6;i++){ const q=panel.parentElement; if(!q) break; const r=q.getBoundingClientRect(); if(r.width>1500) break; panel=q; }
  const out=[];
  for (const e of panel.querySelectorAll('*')) {
    const c=getComputedStyle(e); const r=e.getBoundingClientRect();
    if (r.width>600 && r.height>300 && (c.backgroundColor!=='rgba(0, 0, 0, 0)' || c.backgroundImage!=='none' || c.opacity!=='1' || c.filter!=='none' || c.mixBlendMode!=='normal'))
      out.push(`<${e.tagName}> ${r.width.toFixed(0)}x${r.height.toFixed(0)} bg=${c.backgroundColor} bgi=${c.backgroundImage.slice(0,90)} op=${c.opacity} filter=${c.filter} blend=${c.mixBlendMode}`);
  }
  const ic=getComputedStyle(img);
  out.push(`IMG filter=${ic.filter} op=${ic.opacity} blend=${ic.mixBlendMode} objfit=${ic.objectFit}`);
  return out;
});
r.forEach(x=>console.log(x));
await b.close();
