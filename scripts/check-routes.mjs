const base = process.env.ROOSA_QA_BASE_URL ?? "http://127.0.0.1:3000";
const sitemapResponse = await fetch(`${base}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const failures = [];

for (const pathname of urls) {
  const response = await fetch(`${base}${pathname}`, { redirect: "manual" });
  if (response.status < 200 || response.status >= 400) failures.push({ pathname, status: response.status });
}

if (failures.length) {
  console.error(failures);
  process.exitCode = 1;
} else {
  console.log(`Checked ${urls.length} localized routes: all returned 2xx/3xx.`);
}
