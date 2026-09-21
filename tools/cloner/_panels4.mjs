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
    for (const e of document.querySelectorAll('*')) {
      const r=e.getBoundingClientRect();
      if (r.width<10 || r.x>1440 || r.y<140 || r.y>760) continue;
      const t=(e.textContent||'').trim();
      const c=getComputedStyle(e);
      if (e.children.length===0 && /^(Benefits|Ingredients|Quality and Certification)$/.test(t))
        out.push(`T "${t}" x=${Math.round(r.x)} y=${Math.round(r.y)} fs=${c.fontSize} lh=${c.lineHeight} fw=${c.fontWeight} color=${c.color}`);
      if (c.borderTopWidth!=='0px' && r.width>300 && r.width<900)
        out.push(`RULE x=${Math.round(r.x)} y=${Math.round(r.y)} w=${Math.round(r.width)} h=${Math.round(r.height)} bt=${c.borderTopWidth} ${c.borderTopColor}`);
    }
    return [...new Set(out)].slice(0,12);
  });
  console.log('=== '+label); r.forEach(x=>console.log('  '+x));
  await p.context().close();
}
await b.close();
