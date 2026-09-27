import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  turbopack: { root: process.cwd() },
  // The template's English legal placeholders, replaced by the German pages
  // taken from the live site. There is no separate cookie policy: cookies are
  // covered in the Datenschutzerklärung.
  redirects() {
    return [
      { source: "/privacy-policy", destination: "/datenschutzerklaerung", permanent: true },
      { source: "/cookies-policy", destination: "/datenschutzerklaerung#cookies", permanent: true },
    ];
  },
};

export default nextConfig;
