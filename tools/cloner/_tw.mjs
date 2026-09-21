import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2200);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}});
  await p.waitForTimeout(800);
  const r = await p.evaluate(()=>{
    const names=['Vitamins','Probiotics','Antioxidants','Guarana extract','Passionfruit powder'];
    const leaf=(t)=>[...document.querySelectorAll('*')].filter(e=>e.children.length===0 && (e.textContent||'').trim()===t)[0];
    return names.map(n=>{const e=leaf(n); if(!e) return n+':none';
      const rg=document.createRange(); rg.selectNodeContents(e); const b=rg.getBoundingClientRect();
      const c=getComputedStyle(e);
      return `${n} textW=${b.width.toFixed(1)} fs=${c.fontSize} ls=${c.letterSpacing} fw=${c.fontWeight} ff=${c.fontFamily.split(',')[0]} fvs=${c.fontVariationSettings} stretch=${c.fontStretch}`;});
  });
  console.log(label); r.forEach(x=>console.log('  '+x));
  await p.context().close();
}
await b.close();
