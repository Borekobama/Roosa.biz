import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://solene.framer.ai/science', { waitUntil:'domcontentloaded', timeout:90000 });
await p.waitForTimeout(2600);
await p.evaluate(()=>window.scrollTo(0,900));
await p.waitForTimeout(900);
const r = await p.evaluate(()=>{
  const out=[];
  for (const e of document.querySelectorAll('*')) {
    const r=e.getBoundingClientRect();
    if (r.top<620||r.top>900||r.width<6) continue;
    const c=getComputedStyle(e);
    if (e.children.length===0 && (e.textContent||'').trim())
      out.push(`T x=${Math.round(r.x)} y=${Math.round(r.y)} w=${Math.round(r.width)} fs=${c.fontSize} lh=${c.lineHeight} fw=${c.fontWeight} ls=${c.letterSpacing} color=${c.color} ff=${c.fontFamily.split(',')[0]} "${e.textContent.trim().slice(0,34)}"`);
    if (c.backgroundColor!=='rgba(0, 0, 0, 0)')
      out.push(`B <${e.tagName}> x=${Math.round(r.x)} y=${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)} bg=${c.backgroundColor} r=${c.borderRadius} pad=${c.padding} bl=${c.borderLeft}`);
    if (e.tagName==='svg') out.push(`S x=${Math.round(r.x)} y=${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`);
  }
  return [...new Set(out)];
});
r.forEach(x=>console.log(x));
await b.close();
