import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const assets = [
  ["brand/roosa-wordmark.png", "https://roosa.net/wp-content/uploads/2026/03/ROOSA_Schriftzug-1024x213-1.png"],
  ["products/hero-pack.png", "https://roosa.net/wp-content/uploads/2024/01/slider-1.png"],
  ["products/pink-pack.jpg", "https://roosa.net/wp-content/uploads/2026/06/roosa_rosa_stahl-768x768.jpg"],
  ["products/pink-roll.webp", "https://roosa.net/wp-content/uploads/2026/03/ROOSA_2-768x768.webp"],
  ["products/white-pack.jpg", "https://roosa.net/wp-content/uploads/2026/05/roosa_weiss_stahl-768x768.jpg"],
  ["products/embossed-roll.webp", "https://roosa.net/wp-content/uploads/2026/04/4-lagigesWC-Papier-Praegung_2048x-768x768.webp"],
  ["impact/partner-kinderschutz.svg", "https://roosa.net/wp-content/uploads/2026/04/Buendnis-Kinderschutz-ROSA.svg"],
  ["impact/partner-stoppt-mobbing.svg", "https://roosa.net/wp-content/uploads/2026/04/Stoppt-Mobbing-Logo-ROSA.svg"],
  ["journal/little-fighter.jpg", "https://roosa.net/wp-content/uploads/2026/05/logan-titel-1-388x449.jpg"],
  ["journal/field-team.jpg", "https://roosa.net/wp-content/uploads/2026/05/haustuerverkaeufer-388x449.jpg"],
  ["journal/family-support.jpg", "https://roosa.net/wp-content/uploads/2026/04/berlin-titel-388x449.jpg"],
];

const root = path.resolve("public/media");
const concurrency = 4;

async function download([target, url]) {
  const response = await fetch(url, { headers: { "user-agent": "ROOSA redesign asset migration" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const output = path.join(root, target);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, Buffer.from(await response.arrayBuffer()));
  return target;
}

for (let i = 0; i < assets.length; i += concurrency) {
  const batch = assets.slice(i, i + concurrency);
  const downloaded = await Promise.all(batch.map(download));
  downloaded.forEach((file) => console.log(`downloaded ${file}`));
}
