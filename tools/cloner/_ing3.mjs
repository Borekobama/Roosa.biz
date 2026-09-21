import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil:'domcontentloaded', timeout:90000 });
await p.waitForTimeout(2500);
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55));}});
await p.waitForTimeout(800);
const base = await p.evaluate(()=>{
  const e=[...document.querySelectorAll('*')].filter(x=>x.children.length===0&&/^Vitamins$/.test((x.textContent||'').trim()))[0];
  return Math.round(e.getBoundingClientRect().top+window.scrollY);
});
console.log('Vitamins docY', base);
for (let d=-700; d<=500; d+=120) {
  await p.evaluate(v=>window.scrollTo(0,v), base+d);
  await p.waitForTimeout(520);
  const s = await p.evaluate(()=>{
    const imgs=[...document.querySelectorAll('img')].filter(i=>{const r=i.getBoundingClientRect();
      return r.width>60 && r.top>-120 && r.top<960;});
    return imgs.map(i=>{const r=i.getBoundingClientRect();const c=getComputedStyle(i);
      return `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)} op=${c.opacity} ${(i.currentSrc||'').split('/').pop().slice(0,18)}`;});
  });
  console.log(('off'+d).padEnd(8), s.length? s.join(' | ') : '(no images)');
}
await b.close();
