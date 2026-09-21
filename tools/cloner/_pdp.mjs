import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:3111/merch/t-shirt', { waitUntil:'domcontentloaded', timeout:90000 });
await p.waitForTimeout(3000);
const r = await p.evaluate(()=>{
  const out=[];
  for (const e of document.querySelectorAll('*')) {
    const r=e.getBoundingClientRect();
    if (r.top<60||r.top>700||r.width<8) continue;
    if (e.children.length===0 && (e.textContent||'').trim()) {
      const c=getComputedStyle(e);
      out.push(`T x=${Math.round(r.x)} y=${Math.round(r.y)} w=${Math.round(r.width)} h=${Math.round(r.height)} fs=${c.fontSize} lh=${c.lineHeight} fw=${c.fontWeight} ls=${c.letterSpacing} color=${c.color} ff=${c.fontFamily.split(',')[0]} "${e.textContent.trim().slice(0,32)}"`);
    }
    const c=getComputedStyle(e);
    if (c.backgroundColor!=='rgba(0, 0, 0, 0)' && r.width<400 && r.height<70)
      out.push(`B <${e.tagName}> x=${Math.round(r.x)} y=${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)} bg=${c.backgroundColor} r=${c.borderRadius} pad=${c.padding}`);
    if (e.tagName==='IMG' && r.width>100) out.push(`I x=${Math.round(r.x)} y=${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)} r=${c.borderRadius}`);
  }
  return [...new Set(out)];
});
r.forEach(x=>console.log(x));
await b.close();
