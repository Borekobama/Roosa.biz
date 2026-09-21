import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2400);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55));}});
  await p.evaluate(()=>{const e=[...document.querySelectorAll('*')].filter(x=>x.children.length===0&&/Real clarity/.test(x.textContent||''))[0];window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-140);});
  await p.waitForTimeout(900);
  const r = await p.evaluate(()=>{
    const out=[];
    for (const e of document.querySelectorAll('*')) {
      const r=e.getBoundingClientRect();
      if (r.top<60||r.top>880||r.width<20) continue;
      const c=getComputedStyle(e);
      if (e.tagName==='IMG') out.push('IMG '+Math.round(r.x)+','+Math.round(r.y)+' '+Math.round(r.width)+'x'+Math.round(r.height)+' r='+c.borderRadius+' '+(e.currentSrc||'').split('/').pop().slice(0,26));
      else if (c.backgroundColor!=='rgba(0, 0, 0, 0)' && r.width>140) out.push('BOX '+Math.round(r.x)+','+Math.round(r.y)+' '+Math.round(r.width)+'x'+Math.round(r.height)+' bg='+c.backgroundColor+' r='+c.borderRadius+' pad='+c.padding);
      else if (e.children.length===0 && (e.textContent||'').trim()) out.push('T '+Math.round(r.x)+','+Math.round(r.y)+' w='+Math.round(r.width)+' fs='+c.fontSize+' lh='+c.lineHeight+' color='+c.color+' "'+e.textContent.trim().slice(0,26)+'"');
    }
    return [...new Set(out)].slice(0,20);
  });
  console.log('=== '+label); r.forEach(x=>console.log('  '+x));
  await p.context().close();
}
await b.close();
