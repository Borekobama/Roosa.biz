import { chromium } from 'playwright';

/**
 * Re-audit every section's reveal with the method that keeps one-shot effects
 * armed: fresh load, walk down in steps, sample as each target enters.
 */
const ROUTE = process.argv[2] ?? '/';
const TARGETS = JSON.parse(process.argv[3]);
const b = await chromium.launch();
const R = {};
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+ROUTE, { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2800);
  const seen = {};
  for (const t of TARGETS) seen[t] = [];
  for (let y=0; y<22000; y+=380) {
    await p.evaluate(v=>window.scrollTo(0,v), y);
    await p.waitForTimeout(200);
    const s = await p.evaluate((targets)=>{
      const out={};
      for (const t of targets) {
        const e=[...document.querySelectorAll('*')]
          .filter(x=>x.children.length===0 && (x.textContent||'').trim().startsWith(t))[0];
        if(!e){ out[t]=null; continue; }
        const r=e.getBoundingClientRect();
        let n=e, op=1, tf='none';
        for(let i=0;i<6&&n;i++){ const c=getComputedStyle(n); op*=Number(c.opacity);
          if (c.scale && c.scale!=='none') tf='s'+c.scale;
          else if (c.transform!=='none' && tf==='none') { const m=new DOMMatrixReadOnly(c.transform);
            tf = (m.a!==1?'s'+m.a.toFixed(2)+' ':'')+(m.f?'y'+Math.round(m.f):''); }
          n=n.parentElement; }
        out[t]={top:Math.round(r.top), op:Number(op).toFixed(2), tf};
      }
      return out;
    }, TARGETS);
    for (const t of TARGETS) {
      const v=s[t];
      if (v && v.top<1400 && v.top>-300) seen[t].push(`${v.top}:${v.op}${v.tf!=='none'?' '+v.tf:''}`);
    }
    if (TARGETS.every(t=>{ const a=seen[t]; return a.length && Number(a[a.length-1].split(':')[0])< -200; })) break;
  }
  R[label]=seen;
  await p.context().close();
}
for (const t of TARGETS) {
  console.log('• '+t);
  console.log('   src', (R.src[t]||[]).slice(0,5).join('  ') || '(not seen)');
  console.log('   cln', (R.cln[t]||[]).slice(0,5).join('  ') || '(not seen)');
}
await b.close();
