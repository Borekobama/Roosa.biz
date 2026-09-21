import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2800);
  const r = await p.evaluate(()=>{
    const out={};
    const rect=e=>{const r=e.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};};
    const leaf=t=>[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&(e.textContent||'').trim()===t)[0];
    const h1=[...document.querySelectorAll('h1,h2')].find(e=>/Daily well-being/i.test(e.textContent||''));
    if(h1){const c=getComputedStyle(h1);const rg=document.createRange();rg.selectNodeContents(h1);
      out.h1={...rect(h1), textW:Math.round(rg.getBoundingClientRect().width), fs:c.fontSize,lh:c.lineHeight,fw:c.fontWeight,ls:c.letterSpacing,ff:c.fontFamily.split(',')[0],color:c.color};}
    const para=[...document.querySelectorAll('p')].find(e=>/Real vitamins crafted/i.test(e.textContent||''));
    if(para){const c=getComputedStyle(para);out.p={...rect(para),fs:c.fontSize,lh:c.lineHeight,fw:c.fontWeight,ls:c.letterSpacing,ff:c.fontFamily.split(',')[0],maxW:c.maxWidth,color:c.color};}
    for (const t of ['Buy Offer','Know more','Science','Blog','Merch']) {
      const e=leaf(t); if(!e) { out[t]='none'; continue; }
      let n=e; for(let i=0;i<4;i++){ const q=n.parentElement; if(!q) break; const rr=q.getBoundingClientRect(); if(rr.height>56||rr.width>320) break; n=q; }
      const c=getComputedStyle(n);
      out[t]={...rect(n), bg:c.backgroundColor, color:getComputedStyle(e).color, r:c.borderRadius, fs:getComputedStyle(e).fontSize};
    }
    const logo=[...document.querySelectorAll('a,div,img,svg')].find(e=>/^solene/i.test((e.textContent||'').trim())&&e.getBoundingClientRect().y<80&&e.getBoundingClientRect().width<260&&e.getBoundingClientRect().width>60);
    if(logo) out.logo={...rect(logo), tag:logo.tagName};
    return out;
  });
  console.log(label, JSON.stringify(r,null,1));
  await p.context().close();
}
await b.close();
