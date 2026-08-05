import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { products, projects } from "@/lib/content";
import { journalArticles } from "@/lib/journal";
import { roles } from "@/lib/careers";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://roosa.biz";
  const staticPaths = ["", "/shop", "/impact", "/about", "/b2b", "/journal", "/support", "/contact", "/careers", "/privacy", "/imprint", "/shipping", "/returns"];
  return locales.flatMap((locale) => [
    ...staticPaths.map((path) => ({ url: `${base}/${locale}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.7 })),
    ...products.map((product) => ({ url: `${base}/${locale}/product/${product.slug}`, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...projects.map((project) => ({ url: `${base}/${locale}/impact/projects/${project.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...journalArticles.map((article) => ({ url: `${base}/${locale}/journal/${article.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...roles.map((role) => ({ url: `${base}/${locale}/careers/${role.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ]);
}
