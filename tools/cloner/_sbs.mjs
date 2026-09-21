import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
/**
 * Side-by-side composites: capture both sides at a matched scroll position and
 * stitch them into one labelled image. Composition happens in a browser page
 * rather than through an image library, so this needs no extra dependency.
 *
 * Usage: OUT=dir VW=390 STOPS="src:1300=cln:1300,src:6150=cln:6150" node _sbs.mjs
 * Each stop is a source scrollY and the clone scrollY to compare it against.
 */
const OUT = process.env.OUT ?? '/tmp/sbs';
const VW = Number(process.env.VW ?? 390);
const VH = Number(process.env.VH ?? 844);
const NAME = process.env.NAME ?? 'shot';
const STOPS = (process.env.STOPS ?? '0=0').split(',').map((s) => s.split('=').map(Number));
fs.mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
const grab = async (base, ys) => {
  const p = await (await b.newContext({ viewport: { width: VW, height: VH }, isMobile: VW < 720, hasTouch: VW < 720, deviceScaleFactor: 2 })).newPage();
  await p.goto(base + (process.env.ROUTE ?? '/'), { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForTimeout(2600);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 320) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 45)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(1200);
  const out = [];
  for (const y of ys) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(800);
    out.push(await p.screenshot());
  }
  await p.context().close();
  return out;
};

const srcShots = await grab('https://solene.framer.ai', STOPS.map((s) => s[0]));
const clnShots = await grab(process.env.CLONE_BASE ?? 'http://localhost:3111', STOPS.map((s) => s[1]));

// Stitch: one page holding both captures with labels, screenshotted whole.
const page = await (await b.newContext({ viewport: { width: VW * 2 + 60, height: VH + 80 }, deviceScaleFactor: 1 })).newPage();
for (let i = 0; i < STOPS.length; i++) {
  const a = `data:image/png;base64,${srcShots[i].toString('base64')}`;
  const c = `data:image/png;base64,${clnShots[i].toString('base64')}`;
  await page.setContent(`<!doctype html><style>
    body{margin:0;background:#15180f;font:13px ui-sans-serif,system-ui;color:#e8ffa9;display:flex;gap:20px;padding:20px}
    figure{margin:0}figcaption{padding:6px 2px;letter-spacing:.02em}
    img{display:block;width:${VW}px;border:1px solid #3a4327}
  </style>
  <figure><figcaption>SOURCE — solene.framer.ai @ ${STOPS[i][0]}</figcaption><img src="${a}"></figure>
  <figure><figcaption>CLONE — localhost:3111 @ ${STOPS[i][1]}</figcaption><img src="${c}"></figure>`);
  await page.waitForTimeout(350);
  const file = path.join(OUT, `${NAME}-${i + 1}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(file);
}
await b.close();
