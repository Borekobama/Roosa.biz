import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/blog', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2800);
  await p.evaluate(()=>window.scrollTo(0,330));
  await p.waitForTimeout(800);
  const r = await p.evaluate(()=>{
    const img=[...document.querySelectorAll('img')].filter(i=>i.getBoundingClientRect().width>400)[0];
    if(!img) return 'no card image';
    let card=img; for(let i=0;i<6;i++){const q=card.parentElement; if(!q)break; const r=q.getBoundingClientRect(); if(r.width>760) break; card=q;}
    const cr=card.getBoundingClientRect();
    const out={card:{x:Math.round(cr.x),y:Math.round(cr.y),w:Math.round(cr.width),h:Math.round(cr.height),r:getComputedStyle(card).borderRadius}, nodes:[]};
    for (const e of card.querySelectorAll('*')) {
      const r=e.getBoundingClientRect(); const c=getComputedStyle(e);
      if (e.tagName==='IMG') out.nodes.push(`IMG ${Math.round(r.x-cr.x)},${Math.round(r.y-cr.y)} ${Math.round(r.width)}x${Math.round(r.height)} r=${c.borderRadius} t=${c.transform.slice(0,30)}`);
      else if (c.backgroundColor!=='rgba(0, 0, 0, 0)' || c.backdropFilter!=='none')
        out.nodes.push(`BOX <${e.tagName}> ${Math.round(r.x-cr.x)},${Math.round(r.y-cr.y)} ${Math.round(r.width)}x${Math.round(r.height)} bg=${c.backgroundColor} r=${c.borderRadius} pad=${c.padding} blur=${c.backdropFilter}`);
      else if (e.children.length===0 && (e.textContent||'').trim())
        out.nodes.push(`T ${Math.round(r.x-cr.x)},${Math.round(r.y-cr.y)} w=${Math.round(r.width)} fs=${c.fontSize} lh=${c.lineHeight} fw=${c.fontWeight} color=${c.color} "${e.textContent.trim().slice(0,30)}"`);
    }
    out.nodes=[...new Set(out.nodes)];
    return out;
  });
  console.log('=== '+label); console.log(JSON.stringify(r,null,1));
  await p.context().close();
}
await b.close();
