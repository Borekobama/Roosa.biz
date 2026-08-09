import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://roosa.biz";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/wireframe",
        "/givewell/",
        "/soma/",
        "/bovist/",
        "/coca-cola-3d/",
        "/sitasys/",
        "/v2-",
        "/v3-",
        "/v4-",
        "/v5-",
        "/v6-",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
