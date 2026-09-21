import { chromium } from 'playwright';

/**
 * Average colour of matched regions in two composites, decoded in a canvas so
 * the figures are real pixels rather than an impression from a capture.
 * usage: _sample.mjs <route> <markerText> <regionsJSON>
 */
const [route, marker, regionsJson] = process.argv.slice(2);
const REGIONS = JSON.parse(regionsJson);
const b = await chromium.launch();
const shots = {};
for (const [base,label] of [['https://solene.framer.ai','src'],[process.env.CLONE_BASE??'http://localhost:3111','cln']]) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto(base+route, { waitUntil:'domcontentloaded', timeout:90000 });
  await p.waitForTimeout(2600);
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,55));}});
  await p.evaluate((m)=>{
    const e=[...document.querySelectorAll('*')].filter(x=>x.children.length===0&&(x.textContent||'').includes(m))[0];
    if(e) window.scrollTo(0, e.getBoundingClientRect().top+window.scrollY-260);
  }, marker);
  await p.waitForTimeout(1000);
  shots[label] = (await p.screenshot()).toString('base64');
  await p.context().close();
}
const ctx = await b.newContext();
const page = await ctx.newPage();
await page.setContent('<canvas id="c"></canvas>');
const out = await page.evaluate(async ({shots, regions}) => {
  const load=(b64)=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src='data:image/png;base64,'+b64;});
  const c=document.getElementById('c'), g=c.getContext('2d');
  const avg=async(b64,[,x,y,w,h])=>{const img=await load(b64);c.width=img.width;c.height=img.height;
    g.clearRect(0,0,c.width,c.height);g.drawImage(img,0,0);
    const d=g.getImageData(x,y,w,h).data;let r=0,gr=0,bl=0;const n=d.length/4;
    for(let i=0;i<d.length;i+=4){r+=d[i];gr+=d[i+1];bl+=d[i+2];}
    return [Math.round(r/n),Math.round(gr/n),Math.round(bl/n)];};
  const rows=[];
  for (const reg of regions){const s=await avg(shots.src,reg),k=await avg(shots.cln,reg);
    rows.push(`${reg[0]} source rgb(${s})  clone rgb(${k})  delta ${k.map((v,i)=>v-s[i])}`);}
  return rows;
}, { shots, regions: REGIONS });
out.forEach(x=>console.log(x));
await b.close();
