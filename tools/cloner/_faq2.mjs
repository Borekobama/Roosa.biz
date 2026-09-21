import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55));}});
  await p.waitForTimeout(800);
  const r = await p.evaluate(()=>{
    const out={};
    const pick=(re)=>[...document.querySelectorAll('h1,h2,h3,h4,h5,p')].filter(e=>re.test((e.innerText||'').trim()))[0];
    const h=pick(/^Frequently/i); const lede=pick(/honest answers/i); const q1=pick(/take Solene daily/i); const q6=pick(/natural and safe/i);
    const box=(e)=>{ if(!e) return null; const r=e.getBoundingClientRect(); const c=getComputedStyle(e);
      return {x:Math.round(r.x), y:Math.round(r.y+scrollY), w:Math.round(r.width), h:Math.round(r.height), fs:c.fontSize, lh:c.lineHeight, color:c.color}; };
    out.heading=box(h); out.lede=box(lede); out.q1=box(q1); out.q6=box(q6);
    return out;
  });
  console.log(label, JSON.stringify(r));
  await p.context().close();
}
await b.close();
