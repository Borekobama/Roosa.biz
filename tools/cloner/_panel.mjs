import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('https://solene.framer.ai/', { waitUntil:'domcontentloaded', timeout:90000 });
await p.waitForTimeout(2500);
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}});
await p.waitForTimeout(1200);
const r = await p.evaluate(()=>{
  const leaf=t=>[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&(e.textContent||'').trim()===t)[0];
  const a=leaf('Energy boost')||leaf('Muscle recovery'); if(!a) return 'not found';
  let panel=a; for(let i=0;i<10&&panel;i++){const r=panel.getBoundingClientRect(); if(r.width>1200&&r.height>400) break; panel=panel.parentElement;}
  const pr=panel.getBoundingClientRect();
  const out={panel:{x:pr.x,y:Math.round(pr.y+scrollY),w:Math.round(pr.width),h:Math.round(pr.height)}, nodes:[]};
  for (const e of panel.querySelectorAll('*')) {
    const r=e.getBoundingClientRect();
    if (e.children.length===0 && (e.textContent||'').trim()) {
      const c=getComputedStyle(e);
      out.nodes.push(`T "${e.textContent.trim().slice(0,40)}" x=${r.x.toFixed(0)} y=${(r.y+scrollY-pr.y-scrollY).toFixed(0)} w=${r.width.toFixed(0)} fs=${c.fontSize} lh=${c.lineHeight} fw=${c.fontWeight} ls=${c.letterSpacing} color=${c.color} ff=${c.fontFamily.split(',')[0]}`);
    }
    if (e.tagName==='svg'||e.tagName==='IMG') out.nodes.push(`M <${e.tagName}> x=${r.x.toFixed(0)} y=${(r.y-pr.y).toFixed(0)} ${r.width.toFixed(0)}x${r.height.toFixed(0)} ${(e.currentSrc||'').split('/').pop().slice(0,40)}`);
  }
  out.nodes=[...new Set(out.nodes)];
  return out;
});
console.log(JSON.stringify(r,null,1));
await b.close();
