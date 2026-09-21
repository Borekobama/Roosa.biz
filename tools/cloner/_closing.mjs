import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2500);
  // reach the foot of the page once so lazy content mounts, then come back up
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55));}});
  await p.evaluate(()=>window.scrollTo(0,0));
  await p.waitForTimeout(800);
  const target = await p.evaluate(()=>{
    const ys=[...document.querySelectorAll('h1,h2')]
      .filter(e=>/Daily well-being requires real/i.test(e.textContent||''))
      .map(e=>Math.round(e.getBoundingClientRect().top+window.scrollY)).sort((a,z)=>z-a);
    return ys[0] ?? null;
  });
  const read = async (off) => {
    await p.evaluate(v=>window.scrollTo(0,Math.max(0,v)), target-off);
    await p.waitForTimeout(600);
    return p.evaluate(()=>{
      const h=[...document.querySelectorAll('h1,h2')]
        .filter(e=>/Daily well-being requires real/i.test(e.textContent||''))
        .sort((a,z)=>z.getBoundingClientRect().top-a.getBoundingClientRect().top)[0];
      if(!h) return 'gone';
      let n=h, op=1, tf='none';
      for(let i=0;i<6&&n;i++){ const c=getComputedStyle(n); op*=Number(c.opacity);
        if (c.scale && c.scale!=='none') tf='scale:'+c.scale;
        else if (c.transform!=='none' && tf==='none') tf=c.transform.slice(0,26);
        n=n.parentElement; }
      return `op=${op.toFixed(2)} ${tf}`;
    });
  };
  console.log(label.padEnd(4), 'docY', target, '| far:', await read(1250), '| entering:', await read(760), '| in view:', await read(320));
  await p.context().close();
}
await b.close();
