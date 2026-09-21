import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil:'domcontentloaded', timeout:90000 });
await p.waitForTimeout(2400);
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55));}});
await p.waitForTimeout(800);
const y = await p.evaluate(()=>{const i=[...document.querySelectorAll('img')].find(x=>(x.currentSrc||'').includes('IxYJnqJjzU3Q0N8ifNUIKEjtxn0'));
  return Math.round(i.getBoundingClientRect().y+scrollY);});
await p.evaluate(v=>window.scrollTo(0,v), y);
await p.waitForTimeout(900);
const r = await p.evaluate(()=>{
  const out=[];
  for (const e of document.querySelectorAll('img,svg,div')) {
    const r=e.getBoundingClientRect();
    if (r.top<-100||r.top>900||r.width<20||r.width>300) continue;
    const c=getComputedStyle(e);
    if (e.tagName==='IMG') out.push(`IMG ${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)} t=${c.transform.slice(0,46)} ${(e.currentSrc||'').split('/').pop().slice(0,36)}`);
    else if (e.tagName==='svg') out.push(`SVG ${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`);
  }
  return [...new Set(out)].slice(0,26);
});
r.forEach(x=>console.log(x));
await b.close();
