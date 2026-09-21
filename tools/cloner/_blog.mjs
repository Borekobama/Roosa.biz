import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/science', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2800);
  const r = await p.evaluate(()=>{
    const out=[];
    for (const e of document.querySelectorAll('*')) {
      const r=e.getBoundingClientRect();
      if (r.top<60||r.top>640||r.width<8) continue;
      const c=getComputedStyle(e);
      if (e.children.length===0 && (e.textContent||'').trim())
        out.push(`T x=${Math.round(r.x)} y=${Math.round(r.y)} w=${Math.round(r.width)} fs=${c.fontSize} lh=${c.lineHeight} fw=${c.fontWeight} ls=${c.letterSpacing} color=${c.color} "${e.textContent.trim().slice(0,38)}"`);
      if (e.tagName==='IMG' && r.width>120) out.push(`I x=${Math.round(r.x)} y=${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)} r=${c.borderRadius}`);
      if (c.backgroundColor!=='rgba(0, 0, 0, 0)' && r.width>200 && r.height<140)
        out.push(`B <${e.tagName}> x=${Math.round(r.x)} y=${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)} bg=${c.backgroundColor} r=${c.borderRadius} pad=${c.padding} blur=${c.backdropFilter}`);
    }
    return [...new Set(out)];
  });
  console.log('=== '+label); r.forEach(x=>console.log('  '+x));
  await p.context().close();
}
await b.close();
