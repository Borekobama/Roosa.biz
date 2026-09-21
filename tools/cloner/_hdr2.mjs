import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2800);
  const r = await p.evaluate(()=>{
    const res=[];
    for (const e of document.querySelectorAll('*')) {
      const r=e.getBoundingClientRect();
      if (r.top<0||r.top>70||r.height<8||r.width<8) continue;
      const t=(e.textContent||'').trim();
      if (e.children.length===0 && t) {
        const c=getComputedStyle(e); const rg=document.createRange(); rg.selectNodeContents(e);
        res.push(`TEXT "${t.slice(0,14)}" x=${r.x.toFixed(0)} y=${r.y.toFixed(0)} tw=${rg.getBoundingClientRect().width.toFixed(1)} fs=${c.fontSize} lh=${c.lineHeight} fw=${c.fontWeight} ls=${c.letterSpacing} color=${c.color} ff=${c.fontFamily.split(',')[0]}`);
      }
      const c=getComputedStyle(e);
      if (c.backgroundColor!=='rgba(0, 0, 0, 0)' && r.width<300) {
        res.push(`BOX  <${e.tagName}> x=${r.x.toFixed(0)} y=${r.y.toFixed(0)} ${r.width.toFixed(0)}x${r.height.toFixed(0)} bg=${c.backgroundColor} r=${c.borderRadius} pad=${c.padding}`);
      }
      if (e.tagName==='svg'||e.tagName==='IMG') res.push(`MEDIA <${e.tagName}> x=${r.x.toFixed(0)} y=${r.y.toFixed(0)} ${r.width.toFixed(0)}x${r.height.toFixed(0)}`);
    }
    return [...new Set(res)];
  });
  console.log('=== '+label); r.forEach(x=>console.log('  '+x));
  await p.context().close();
}
await b.close();
