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
      // The mission page kept the template's /science path until it was renamed.
      { source: "/science", destination: "/mission", permanent: true },
    ];
  },
};

export default nextConfig;
