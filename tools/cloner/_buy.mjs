import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,route,label] of [
  ['https://solene.framer.ai','/merch/daily-multivitamin%E2%84%A2','src'],
  [process.env.CLONE_BASE??'http://localhost:3111','/merch/daily-multivitamin','cln'],
]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+route, { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2600);
  const r = await p.evaluate(()=>{
    const out=[];
    for (const e of document.querySelectorAll('button,a,input,div')) {
      const r=e.getBoundingClientRect(); const c=getComputedStyle(e);
      if (r.width<40 || r.y<380 || r.y>620 || r.x<700 || r.x>1440) continue;
      if (c.backgroundColor==='rgba(0, 0, 0, 0)') continue;
      out.push(`<${e.tagName}> x=${Math.round(r.x)} y=${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)} bg=${c.backgroundColor} r=${c.borderRadius} "${(e.textContent||'').trim().slice(0,18)}"`);
    }
    // the CTA label
    const t=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/Out of Stock|Buy Now|Add to Bag/i.test(e.textContent||''))[0];
    if(t){const c=getComputedStyle(t);const rr=t.getBoundingClientRect();
      out.push(`LABEL "${t.textContent.trim()}" x=${Math.round(rr.x)} y=${Math.round(rr.y)} fs=${c.fontSize} lh=${c.lineHeight} fw=${c.fontWeight} color=${c.color}`);}
    return [...new Set(out)].slice(0,8);
  });
  console.log('=== '+label); r.forEach(x=>console.log('  '+x));
  await p.context().close();
}
await b.close();
