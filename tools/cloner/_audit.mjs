import { chromium } from 'playwright';
const CLN = process.env.CLONE_BASE ?? 'http://localhost:3111';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();

// 1. post transition: the hero must stay put while the article covers it
await p.goto(CLN+'/blog/the-influence-of-micronutrients', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(1600);
const rows=[];
for (const y of [0,300,600,900,1200]) {
  await p.evaluate(v=>window.scrollTo(0,v), y);
  await p.waitForTimeout(400);
  rows.push(await p.evaluate(()=>{
    const img=[...document.querySelectorAll('img')].filter(i=>i.getBoundingClientRect().width>1000)[0];
    const body=[...document.querySelectorAll('h2')].find(e=>/Introduction/i.test(e.textContent||''));
    return (img?Math.round(img.getBoundingClientRect().top):'-')+'|'+(body?Math.round(body.getBoundingClientRect().top):'-');
  }));
}
console.log('POST hero/body top:', rows.join('  '), '-> hero fixed:', new Set(rows.map(r=>r.split('|')[0])).size===1);

// 2. principles boxes present with their glyphs
await p.goto(CLN+'/science', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(1500);
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}});
const sci = await p.evaluate(()=>{
  const names=['Evidence-based formula','Enhanced absorption','Lab verified purity'];
  const boxes=names.map(n=>{
    const e=[...document.querySelectorAll('h3')].find(x=>x.textContent.trim()===n);
    if(!e) return n+':MISSING';
    const card=e.closest('div');
    const svg=card?.querySelector('svg');
    const r=card.getBoundingClientRect();
    return `${n}: ${Math.round(r.width)}x${Math.round(r.height)} glyph=${!!svg}`;
  });
  // comparison table
  const th=[...document.querySelectorAll('th,td')].filter(e=>/Others/.test(e.textContent||''))[0];
  const marks=document.querySelectorAll('table td svg').length;
  return { boxes, othersHeader: !!th, gummyMarks: marks };
});
console.log('PRINCIPLES  ', JSON.stringify(sci.boxes));
console.log('COMPARISON  ', 'Others header:', sci.othersHeader, '| gummy marks in rows:', sci.gummyMarks);

// 3. cart empty-state easter egg
await p.goto(CLN+'/', { waitUntil:'domcontentloaded' });
await p.waitForTimeout(1400);
await p.getByRole('button', { name: 'Open cart' }).click();
await p.waitForTimeout(700);
const cart = await p.evaluate(()=>{
  const a=document.querySelector('aside[aria-label="Your cart"]');
  const img=a?.querySelector('img');
  return { img: img? Math.round(img.getBoundingClientRect().width)+'x'+Math.round(img.getBoundingClientRect().height) : 'none',
           src: decodeURIComponent(img?.currentSrc||'').split('/').pop().slice(0,28),
           text: (a?.innerText||'').replace(/\s+/g,' ').slice(0,46) };
});
console.log('CART empty  ', JSON.stringify(cart));
await b.close();
