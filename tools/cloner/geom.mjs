#!/usr/bin/env node
/**
 * Element-level geometry diff between source and clone.
 *
 * Height ratios cannot see a misplaced nav or a wrong price. This measures the
 * things that are actually visible: position, size, font and text of named
 * elements, side by side.
 */
import { chromium } from 'playwright';

const SOURCE = 'https://solene.framer.ai';
const CLONE = process.env.CLONE_BASE ?? 'http://localhost:3111';

/** Runs in the page: geometry + type for header, CTAs, prices and headings. */
function probe() {
  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      x: Math.round(r.left), y: Math.round(r.top + window.scrollY),
      w: Math.round(r.width), h: Math.round(r.height),
      font: cs.fontSize, weight: cs.fontWeight, color: cs.color,
      bg: cs.backgroundColor, radius: cs.borderRadius,
      text: (el.textContent || '').trim().slice(0, 48),
    };
  };
  const header = document.querySelector('header') || document.body.firstElementChild;
  const headerLinks = header ? [...header.querySelectorAll('a')] : [];
  const headerButtons = header ? [...header.querySelectorAll('button')] : [];

  const priceEl = [...document.querySelectorAll('p,span,div,h1,h2,h3,h4')]
    .filter((e) => /^[$€£]\s?\d/.test((e.textContent || '').trim()) && e.children.length === 0)
    .map(box);

  return {
    viewportWidth: window.innerWidth,
    docHeight: document.documentElement.scrollHeight,
    header: {
      box: box(header),
      position: header ? getComputedStyle(header).position : null,
      links: headerLinks.map(box),
      buttons: headerButtons.map(box),
    },
    prices: priceEl.slice(0, 6),
    h1: [...document.querySelectorAll('h1')].map(box).slice(0, 4),
    firstH2s: [...document.querySelectorAll('h2')].map(box).slice(0, 8),
    buttonsTop: [...document.querySelectorAll('button, a[href="/#product-offer"]')]
      .map(box).filter((b) => b && b.y < 1200).slice(0, 10),
  };
}

const route = process.argv[2] ?? '/';
const sourceRoute = process.argv[3] ?? route;
const width = Number(process.argv[4] ?? 1440);

const browser = await chromium.launch();
const grab = async (base, r) => {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + r, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(1800);
  const out = await p.evaluate(probe);
  await ctx.close();
  return out;
};

const s = await grab(SOURCE, sourceRoute);
const c = await grab(CLONE, route);
await browser.close();

const fmt = (b) => (b ? `x=${b.x} y=${b.y} ${b.w}x${b.h} ${b.font}/${b.weight} "${b.text}"` : 'MISSING');

console.log(`\n### ${route} @ ${width}px   source=${s.docHeight}px clone=${c.docHeight}px`);
console.log(`\nHEADER  pos src=${s.header.position} clone=${c.header.position}`);
console.log(`  box   S ${fmt(s.header.box)}`);
console.log(`        C ${fmt(c.header.box)}`);
console.log(`\nHEADER LINKS (${s.header.links.length} src / ${c.header.links.length} clone)`);
const n = Math.max(s.header.links.length, c.header.links.length);
for (let i = 0; i < n; i += 1) {
  console.log(`  [${i}] S ${fmt(s.header.links[i])}`);
  console.log(`      C ${fmt(c.header.links[i])}`);
}
console.log(`\nHEADER BUTTONS (${s.header.buttons.length} src / ${c.header.buttons.length} clone)`);
const m = Math.max(s.header.buttons.length, c.header.buttons.length);
for (let i = 0; i < m; i += 1) {
  console.log(`  [${i}] S ${fmt(s.header.buttons[i])}`);
  console.log(`      C ${fmt(c.header.buttons[i])}`);
}
console.log(`\nPRICES  S ${s.prices.map((p) => p.text).join(' | ') || 'none'}`);
console.log(`        C ${c.prices.map((p) => p.text).join(' | ') || 'none'}`);
console.log(`\nH1`);
for (let i = 0; i < Math.max(s.h1.length, c.h1.length); i += 1) {
  console.log(`  [${i}] S ${fmt(s.h1[i])}`);
  console.log(`      C ${fmt(c.h1[i])}`);
}
