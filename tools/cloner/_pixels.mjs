import { chromium } from 'playwright';

/**
 * Sample average colour from the same regions of both composites.
 *
 * Screenshots are decoded by the browser itself: both are drawn into a canvas
 * and read back with getImageData, so this reports real pixel values rather
 * than an impression from looking at a capture.
 */
const REGIONS = [
  ['text area   ', 120, 180, 360, 120],
  ['panel centre', 560, 300, 300, 160],
  ['upper right ', 1050, 120, 260, 140],
  ['lower left  ', 120, 560, 300, 140],
];

const b = await chromium.launch();
const shots = {};
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+'/', { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2500);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55));}});
  // put the panel's top edge at the viewport top on both sides
  const top = await p.evaluate(()=>{
    const e=[...document.querySelectorAll('*')].filter(x=>x.children.length===0&&/SOL-G7/.test(x.textContent||''))[0];
    let n=e; for(let i=0;i<9&&n;i++){const r=n.getBoundingClientRect(); if(r.width>1300&&r.height>600) break; n=n.parentElement;}
    return Math.round(n.getBoundingClientRect().top+window.scrollY);
  });
  await p.evaluate(v=>window.scrollTo(0,v), top);
  await p.waitForTimeout(900);
  shots[label] = (await p.screenshot({ clip:{x:32,y:0,width:1376,height:780} })).toString('base64');
  await p.context().close();
}

const ctx = await b.newContext();
const page = await ctx.newPage();
await page.setContent('<canvas id="c"></canvas>');
const out = await page.evaluate(async ({shots, regions}) => {
  const load = (b64) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,'+b64; });
  const c = document.getElementById('c'); const g = c.getContext('2d');
  const avg = async (b64, [ , x, y, w, h]) => {
    const img = await load(b64);
    c.width = img.width; c.height = img.height;
    g.clearRect(0,0,c.width,c.height); g.drawImage(img,0,0);
    const d = g.getImageData(x,y,w,h).data;
    let r=0,gr=0,bl=0; const n=d.length/4;
    for (let i=0;i<d.length;i+=4){ r+=d[i]; gr+=d[i+1]; bl+=d[i+2]; }
    return [Math.round(r/n), Math.round(gr/n), Math.round(bl/n)];
  };
  const rows=[];
  for (const reg of regions) {
    const s = await avg(shots.src, reg);
    const k = await avg(shots.cln, reg);
    rows.push(`${reg[0]} source rgb(${s.join(',')})  clone rgb(${k.join(',')})  delta ${k.map((v,i)=>v-s[i]).join(',')}`);
  }
  return rows;
}, { shots, regions: REGIONS });
out.forEach(x=>console.log(x));
await b.close();
